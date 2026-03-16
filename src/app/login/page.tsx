"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"sms" | "email">("sms");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  function handleSendCode() {
    if (phone.length > 0) setShowOtp(true);
  }

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }

    // Auto-submit when all filled
    if (newOtp.every((d) => d !== "")) {
      setTimeout(() => router.push("/member"), 400);
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  }

  function handleEmailLogin() {
    if (email && password) router.push("/member");
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
        {!showOtp ? (
          <>
            <div className="login-header">
              <h1>Welcome Back</h1>
              <p>
                Sign in to access your membership,
                <br />
                view your QR code, and manage your plan.
              </p>
            </div>

            <div className="login-card">
              {/* Tab switcher */}
              <div className="login-tabs">
                <button
                  className={`login-tab${tab === "sms" ? " active" : ""}`}
                  onClick={() => setTab("sms")}
                >
                  📱 Phone (SMS)
                </button>
                <button
                  className={`login-tab${tab === "email" ? " active" : ""}`}
                  onClick={() => setTab("email")}
                >
                  ✉️ Email
                </button>
              </div>

              {/* SMS form */}
              {tab === "sms" && (
                <div className="login-form-content">
                  <label className="login-field-label">Phone Number</label>
                  <div className="phone-input-wrap">
                    <div className="phone-prefix">+1</div>
                    <input
                      type="tel"
                      className="phone-number-input"
                      placeholder="(310) 555-1234"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <button className="login-btn login-btn-red" onClick={handleSendCode}>
                    Send Verification Code →
                  </button>
                  <p className="login-hint">
                    We&apos;ll text you a 6-digit code. Standard rates apply.
                  </p>
                </div>
              )}

              {/* Email form */}
              {tab === "email" && (
                <div className="login-form-content">
                  <label className="login-field-label">Email Address</label>
                  <input
                    type="email"
                    className="login-field-input"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="login-field-label">Password</label>
                  <input
                    type="password"
                    className="login-field-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <a href="#" className="login-forgot">Forgot password?</a>
                  <button className="login-btn login-btn-red" onClick={handleEmailLogin}>
                    Sign In →
                  </button>
                </div>
              )}

              <div className="login-divider"><span>or</span></div>

              <div className="login-footer-text">
                Not a member yet?{" "}
                <Link href="/signup">Join for $14.99/mo →</Link>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* OTP Screen */}
            <div className="login-header">
              <h1>Enter Code</h1>
              <p>
                We sent a 6-digit verification code to
                <br />
                <strong>{phone || "(310) 555-1234"}</strong>
              </p>
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
                    onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <div className="otp-resend">
                Didn&apos;t get it?{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>Resend code</a>
                {" · "}
                <a href="#" onClick={(e) => { e.preventDefault(); setShowOtp(false); setOtp(["","","","","",""]); }}>
                  Change number
                </a>
              </div>

              <button className="login-btn login-btn-red" onClick={() => router.push("/member")}>
                Verify &amp; Sign In →
              </button>

              <p className="login-hint" style={{ marginTop: "16px" }}>
                Code expires in 5:00
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}