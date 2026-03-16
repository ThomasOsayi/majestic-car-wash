"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StaffLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);

  function handlePinChange(index: number, value: string) {
    if (value.length > 1) return;
    const digit = value.replace(/\D/g, "");
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    setError(false);

    if (digit && index < 3) {
      const next = document.getElementById(`staff-pin-${index + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }

    // Auto-submit when all 4 filled
    if (newPin.every((d) => d !== "")) {
      // For now, any 4-digit PIN works — real auth in Phase 2
      setTimeout(() => router.push("/admin"), 300);
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prev = document.getElementById(`staff-pin-${index - 1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  }

  return (
    <div className="staff-login-page">
      <div className="staff-login-bg" />

      <div className="staff-login-wrap">
        <Link href="/" className="staff-login-logo">
          <div className="staff-login-logo-icon">M</div>
          <span>Majestic Car Wash</span>
        </Link>

        <div className="staff-login-card">
          <div className="staff-login-badge">🔒 Staff Only</div>
          <h1 className="staff-login-title">Staff Login</h1>
          <p className="staff-login-desc">Enter your 4-digit staff PIN to access the dashboard.</p>

          <div className="staff-pin-inputs">
            {pin.map((digit, i) => (
              <input
                key={i}
                id={`staff-pin-${i}`}
                type="password"
                inputMode="numeric"
                className={`staff-pin-box${digit ? " filled" : ""}${error ? " error" : ""}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {error && (
            <div className="staff-login-error">Incorrect PIN. Please try again.</div>
          )}

          <button
            className="staff-login-btn"
            onClick={() => {
              if (pin.every((d) => d !== "")) {
                router.push("/admin");
              }
            }}
          >
            Access Dashboard →
          </button>

          <p className="staff-login-hint">
            Forgot your PIN? Ask your manager.
          </p>
        </div>

        <Link href="/" className="staff-login-back">← Back to website</Link>
      </div>
    </div>
  );
}