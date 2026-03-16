"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMemberByPhone, getMemberByEmail } from "@/lib/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"sms" | "email">("sms");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePhoneLogin() {
    if (!phone.trim()) return;
    setLoading(true);
    setError("");

    try {
      const member = await getMemberByPhone(phone);
      if (member?.id) {
        localStorage.setItem("memberId", member.id);
        router.push("/member");
      } else {
        setError("No membership found with that phone number.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailLogin() {
    if (!email.trim()) return;
    setLoading(true);
    setError("");

    try {
      const member = await getMemberByEmail(email);
      if (member?.id) {
        localStorage.setItem("memberId", member.id);
        router.push("/member");
      } else {
        setError("No membership found with that email address.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (tab === "sms") handlePhoneLogin();
      else handleEmailLogin();
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
              onClick={() => { setTab("sms"); setError(""); }}
            >
              📱 Phone Number
            </button>
            <button
              className={`login-tab${tab === "email" ? " active" : ""}`}
              onClick={() => { setTab("email"); setError(""); }}
            >
              ✉️ Email
            </button>
          </div>

          {/* Phone login */}
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
                  onChange={(e) => { setPhone(e.target.value); setError(""); }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <p className="login-hint" style={{ marginBottom: "18px" }}>
                Enter the phone number you used to sign up.
              </p>
              {error && <div className="login-error">{error}</div>}
              <button
                className="login-btn login-btn-red"
                onClick={handlePhoneLogin}
                disabled={loading}
                style={loading ? { opacity: 0.6 } : {}}
              >
                {loading ? "Looking up membership..." : "Sign In →"}
              </button>
            </div>
          )}

          {/* Email login */}
          {tab === "email" && (
            <div className="login-form-content">
              <label className="login-field-label">Email Address</label>
              <input
                type="email"
                className="login-field-input"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onKeyDown={handleKeyDown}
              />
              <p className="login-hint" style={{ marginBottom: "18px" }}>
                Enter the email you used to sign up.
              </p>
              {error && <div className="login-error">{error}</div>}
              <button
                className="login-btn login-btn-red"
                onClick={handleEmailLogin}
                disabled={loading}
                style={loading ? { opacity: 0.6 } : {}}
              >
                {loading ? "Looking up membership..." : "Sign In →"}
              </button>
            </div>
          )}

          <div className="login-divider"><span>or</span></div>

          <div className="login-footer-text">
            Not a member yet?{" "}
            <Link href="/signup">Join for $14.99/mo →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}