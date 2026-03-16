"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createMember } from "@/lib/firestore";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [memberData, setMemberData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setError("No session found. Please try signing up again.");
      return;
    }

    async function verifyAndCreate() {
      try {
        // 1. Verify the Stripe session
        const res = await fetch("/api/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Verification failed");
        }

        const data = await res.json();
        if (!data.verified) throw new Error("Session not verified");
        setMemberData(data);

        // 2. Create Firebase Auth user
        const password = sessionStorage.getItem("signup_password");
        let authUid = "";

        if (password && data.email) {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, password);
            authUid = userCredential.user.uid;
          } catch (authError: any) {
            // If email already exists in Auth, that's OK — they might be re-signing up
            if (authError.code === "auth/email-already-in-use") {
              console.warn("Auth account already exists for this email");
            } else {
              console.error("Auth creation failed:", authError);
              // Don't block signup — auth can be linked later
            }
          }
          sessionStorage.removeItem("signup_password");
        }

        // 3. Create member in Firestore
        const memberSince = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

        const memberId = await createMember({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          plan: data.plan as "essential" | "premium" | "ultimate",
          planName: data.planName,
          price: data.price,
          status: "active",
          vehicleType: data.vehicleType as "sedan" | "suv" | "van",
          make: data.make,
          model: data.model,
          color: data.color,
          plate: data.plate,
          surcharge: data.surcharge,
          memberSince,
          nextBilling: data.nextBilling,
          stripeCustomerId: data.customerId,
          stripeSubscriptionId: data.subscriptionId,
          authUid,
        });

        localStorage.setItem("memberId", memberId);
        setStatus("success");
      } catch (err: any) {
        console.error("Verification failed:", err);
        setStatus("error");
        setError(err.message || "Something went wrong.");
      }
    }

    verifyAndCreate();
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="signup-page">
        <div className="signup-bg" />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "16px" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--red)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>Activating your membership...</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="signup-page">
        <div className="signup-bg" />
        <div className="signup-topbar"><Link href="/" className="signup-logo"><div className="signup-logo-icon">M</div><span>Majestic Car Wash</span></Link></div>
        <div className="signup-container">
          <div className="signup-card">
            <div className="signup-step-content" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
              <h2 className="signup-title">Something Went Wrong</h2>
              <p className="signup-desc">{error}</p>
              <div className="signup-btns" style={{ justifyContent: "center", marginTop: "24px" }}>
                <Link href="/signup" className="signup-btn primary" style={{ textDecoration: "none" }}>Try Again →</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-bg" />
      <div className="signup-topbar"><Link href="/" className="signup-logo"><div className="signup-logo-icon">M</div><span>Majestic Car Wash</span></Link></div>
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-step-content confirm-wrap">
            <div className="confirm-icon">✓</div>
            <h2 className="confirm-title">Welcome to Majestic!</h2>
            <p className="confirm-sub">Your membership is active and your payment is confirmed.<br />Drive in anytime — just give us your name or show your QR code.</p>
            <div className="confirm-details">
              <h4>Membership Details</h4>
              <div className="confirm-row"><span>Plan</span><strong>{memberData?.planName}</strong></div>
              <div className="confirm-row"><span>Vehicle</span><strong>{memberData?.make} {memberData?.model}</strong></div>
              <div className="confirm-row"><span>Plate</span><strong>{memberData?.plate || "—"}</strong></div>
              <div className="confirm-row"><span>Charged today</span><strong className="gold-text">$14.99</strong></div>
              <div className="confirm-row"><span>Next charge</span><strong>{memberData?.nextBilling}</strong></div>
              <div className="confirm-row"><span>Monthly rate</span><strong>${memberData?.price?.toFixed(2)}/mo</strong></div>
            </div>
            <div className="signup-btns" style={{ justifyContent: "center", gap: "12px" }}>
              <Link href="/member" className="signup-btn gold" style={{ textDecoration: "none", flex: "none", padding: "16px 32px" }}>View My Dashboard →</Link>
              <Link href="/" className="signup-btn ghost" style={{ textDecoration: "none", flex: "none", padding: "16px 32px" }}>Back to Majestic</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupSuccessPage() {
  return (
    <Suspense fallback={<div className="signup-page"><div className="signup-bg" /><div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}><div style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px" }}>Loading...</div></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}