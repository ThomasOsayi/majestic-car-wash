"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getMemberByAuthUid, getMemberByPhone, getMemberByEmail } from "@/lib/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Phone OTP state
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Initialize invisible reCAPTCHA
  useEffect(() => {
    if (typeof window !== "undefined" && !recaptchaVerifierRef.current) {
      // We'll initialize on demand when needed
    }
    return () => {
      if (recaptchaVerifierRef.current) {
        try { recaptchaVerifierRef.current.clear(); } catch { /* ignore */ }
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  /* ===== EMAIL/PASSWORD LOGIN ===== */
  async function handleEmailLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Look up member by auth UID
      const member = await getMemberByAuthUid(uid);
      if (member?.id) {
        localStorage.setItem("memberId", member.id);
        router.push("/member");
      } else {
        // Fallback: try email lookup (for members created before auth was added)
        const memberByEmail = await getMemberByEmail(email);
        if (memberByEmail?.id) {
          localStorage.setItem("memberId", memberByEmail.id);
          router.push("/member");
        } else {
          setError("Account found but no membership linked. Please contact us.");
        }
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        // Try Firestore-only lookup as fallback for pre-auth members
        try {
          const member = await getMemberByEmail(email);
          if (member?.id) {
            localStorage.setItem("memberId", member.id);
            router.push("/member");
            return;
          }
        } catch { /* ignore */ }
        setError("Invalid email or password. If you signed up before passwords were required, try the phone tab.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a moment and try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  /* ===== PHONE OTP LOGIN ===== */
  async function handleSendOtp() {
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Format phone number
      const digits = phone.replace(/\D/g, "");
      const formattedPhone = digits.startsWith("1") ? `+${digits}` : `+1${digits}`;

      // Initialize reCAPTCHA
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      }

      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setShowOtp(true);
    } catch (err: any) {
      console.error("OTP send failed:", err);
      if (err.code === "auth/invalid-phone-number") {
        setError("Invalid phone number format.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a moment.");
      } else {
        // Fallback to Firestore lookup if phone auth isn't available
        try {
          const member = await getMemberByPhone(phone);
          if (member?.id) {
            localStorage.setItem("memberId", member.id);
            router.push("/member");
            return;
          }
        } catch { /* ignore */ }
        setError("Could not send verification code. Try the email tab instead.");
      }

      // Reset reCAPTCHA on error
      if (recaptchaVerifierRef.current) {
        try { recaptchaVerifierRef.current.clear(); } catch { /* ignore */ }
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!confirmationResult) return;
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const userCredential = await confirmationResult.confirm(code);
      const uid = userCredential.user.uid;

      // Look up member by auth UID first
      let member = await getMemberByAuthUid(uid);
      if (!member) {
        // Try phone number lookup and link auth
        member = await getMemberByPhone(phone);
      }

      if (member?.id) {
        localStorage.setItem("memberId", member.id);
        router.push("/member");
      } else {
        setError("Phone verified but no membership found. Please sign up first.");
      }
    } catch (err: any) {
      console.error("OTP verify failed:", err);
      if (err.code === "auth/invalid-verification-code") {
        setError("Invalid code. Please check and try again.");
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) return;
    const digit = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError("");

    if (digit && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }

    if (newOtp.every((d) => d !== "")) {
      setTimeout(() => handleVerifyOtp(), 200);
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (tab === "email") handleEmailLogin();
      else if (!showOtp) handleSendOtp();
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg" />

      <div className="login-topbar">
        <Link href="/" className="login-logo">
          <div className="login-logo-icon">M</div>
          <span>Majestic Car Wash</span>
        </Link>
        <Link href="/" className="login-back">← Back to site</Link>
      </div>

      <div className="login-wrap">
        {/* reCAPTCHA container (invisible) */}
        <div id="recaptcha-container" ref={recaptchaRef} />

        {!showOtp ? (
          <>
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>Sign in to access your membership,<br />view your QR code, and manage your plan.</p>
            </div>

            <div className="login-card">
              <div className="login-tabs">
                <button className={`login-tab${tab === "email" ? " active" : ""}`} onClick={() => { setTab("email"); setError(""); }}>
                  ✉️ Email
                </button>
                <button className={`login-tab${tab === "phone" ? " active" : ""}`} onClick={() => { setTab("phone"); setError(""); }}>
                  📱 Phone
                </button>
              </div>

              {tab === "email" && (
                <div className="login-form-content">
                  <label className="login-field-label">Email Address</label>
                  <input type="email" className="login-field-input" placeholder="john@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} onKeyDown={handleKeyDown} />
                  <label className="login-field-label">Password</label>
                  <input type="password" className="login-field-input" placeholder="Your password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} onKeyDown={handleKeyDown} />
                  {error && <div className="login-error">{error}</div>}
                  <button className="login-btn login-btn-red" onClick={handleEmailLogin} disabled={loading} style={loading ? { opacity: 0.6 } : {}}>
                    {loading ? "Signing in..." : "Sign In →"}
                  </button>
                </div>
              )}

              {tab === "phone" && (
                <div className="login-form-content">
                  <label className="login-field-label">Phone Number</label>
                  <div className="phone-input-wrap">
                    <div className="phone-prefix">+1</div>
                    <input type="tel" className="phone-number-input" placeholder="(310) 555-1234" value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }} onKeyDown={handleKeyDown} />
                  </div>
                  <p className="login-hint" style={{ marginBottom: "18px" }}>We&rsquo;ll text you a 6-digit verification code.</p>
                  {error && <div className="login-error">{error}</div>}
                  <button className="login-btn login-btn-red" onClick={handleSendOtp} disabled={loading} style={loading ? { opacity: 0.6 } : {}}>
                    {loading ? "Sending code..." : "Send Verification Code →"}
                  </button>
                </div>
              )}

              <div className="login-divider"><span>or</span></div>
              <div className="login-footer-text">
                Not a member yet? <Link href="/signup">Join for $14.99/mo →</Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="login-header">
              <h1>Enter Code</h1>
              <p>We sent a 6-digit verification code to<br /><strong>{phone}</strong></p>
            </div>

            <div className="login-card">
              <div className="otp-inputs">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    className={`otp-box${digit ? " filled" : ""}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && <div className="login-error" style={{ marginTop: "16px" }}>{error}</div>}

              <div className="otp-resend">
                Didn&apos;t get it?{" "}
                <a href="#" onClick={(e) => { e.preventDefault(); handleSendOtp(); }}>Resend code</a>
                {" · "}
                <a href="#" onClick={(e) => { e.preventDefault(); setShowOtp(false); setOtp(["","","","","",""]); setError(""); setConfirmationResult(null); }}>Change number</a>
              </div>

              <button className="login-btn login-btn-red" onClick={handleVerifyOtp} disabled={loading} style={loading ? { opacity: 0.6 } : {}}>
                {loading ? "Verifying..." : "Verify & Sign In →"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}