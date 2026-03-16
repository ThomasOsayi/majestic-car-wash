"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

/* ===== DATA ===== */
const PLANS: Record<string, { name: string; price: number; desc: string }> = {
  essential: { name: "Essential", price: 34.99, desc: "Unlimited exterior hand wash" },
  premium: { name: "Premium", price: 49.99, desc: "Unlimited full-service hand wash" },
  ultimate: { name: "Ultimate", price: 64.99, desc: "Full-service + monthly detail" },
};

const PROMO_PRICE = 14.99;

const CAR_MAKES = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler",
  "Dodge", "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti",
  "Jaguar", "Jeep", "Kia", "Land Rover", "Lexus", "Lincoln", "Mazda",
  "Mercedes-Benz", "Mini", "Nissan", "Porsche", "Ram", "Rivian",
  "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo", "Other",
];

/* ===== SIGNUP FORM COMPONENT ===== */
function SignupForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

  // If plan is in URL, skip step 1
  const hasPreselectedPlan = planParam && PLANS[planParam];
  const initialStep = hasPreselectedPlan ? 2 : 1;

  const [step, setStep] = useState(initialStep);
  const [plan, setPlan] = useState(planParam && PLANS[planParam] ? planParam : "premium");
  const [vehicleType, setVehicleType] = useState("sedan");
  const [surcharge, setSurcharge] = useState(0);
  const [form, setForm] = useState({
    make: "", model: "", color: "", plate: "",
    firstName: "", lastName: "", email: "", phone: "",
    cardNumber: "", expiry: "", cvc: "",
  });

  const currentPlan = PLANS[plan];
  const monthlyTotal = currentPlan.price + surcharge;
  const savings = monthlyTotal - PROMO_PRICE;

  /* Progress bar config */
  const steps = hasPreselectedPlan
    ? [
        { num: 1, label: "Vehicle" },
        { num: 2, label: "Info" },
        { num: 3, label: "Payment" },
      ]
    : [
        { num: 1, label: "Plan" },
        { num: 2, label: "Vehicle" },
        { num: 3, label: "Info" },
        { num: 4, label: "Payment" },
      ];

  const totalSteps = steps.length;
  const confirmStep = totalSteps + 1;

  const stepIndex = hasPreselectedPlan ? step - 1 : step;

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function selectVehicleType(type: string, extra: number) {
    setVehicleType(type);
    setSurcharge(extra);
  }

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").substring(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").substring(0, 4);
    if (digits.length >= 2) return digits.substring(0, 2) + " / " + digits.substring(2);
    return digits;
  }

  function getLastFour() {
    const digits = form.cardNumber.replace(/\D/g, "");
    return digits.length >= 13 ? digits.slice(-4) : "••••";
  }

  function getNextChargeDate() {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  /* ===== RENDER ===== */
  return (
    <div className="signup-page">
      {/* Background */}
      <div className="signup-bg" />

      {/* Top bar */}
      <div className="signup-topbar">
        <Link href="/" className="signup-logo">
          <div className="signup-logo-icon">M</div>
          <span>Majestic Car Wash</span>
        </Link>
        <Link href="/" className="signup-back">← Back to site</Link>
      </div>

      <div className="signup-container">
        {/* Progress bar */}
        {step <= totalSteps && (
          <div className="signup-progress">
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
                <div className="signup-progress-step">
                  <div className={`signup-dot${stepIndex > i + 1 ? " done" : stepIndex === i + 1 ? " active" : ""}`}>
                    {stepIndex > i + 1 ? "✓" : i + 1}
                  </div>
                  <span className={`signup-step-label${stepIndex > i + 1 ? " done" : stepIndex === i + 1 ? " active" : ""}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="signup-line">
                    <div className={`signup-line-fill${stepIndex > i + 1 ? " filled" : ""}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="signup-card">
          {/* STEP 1: Plan Selection (only if no URL param) */}
          {step === 1 && !hasPreselectedPlan && (
            <div className="signup-step-content">
              <h2 className="signup-title">Choose Your Plan</h2>
              <p className="signup-desc">Unlimited hand washes, one monthly price. Cancel anytime.</p>

              <div className="plan-options">
                {Object.entries(PLANS).map(([key, p]) => (
                  <div
                    key={key}
                    className={`plan-option${plan === key ? " selected" : ""}`}
                    onClick={() => setPlan(key)}
                  >
                    {key === "premium" && <div className="plan-badge-tag">Most Popular</div>}
                    <div className="plan-radio"><div className="plan-radio-dot" /></div>
                    <div className="plan-info">
                      <div className="plan-name">{p.name}</div>
                      <div className="plan-detail">{p.desc}</div>
                    </div>
                    <div className="plan-price-col">
                      <div className="plan-price-main">${p.price.toFixed(2)}</div>
                      <div className="plan-price-period">per month</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="promo-note-box">
                <span>🎉</span>
                <p>First month just <strong>$14.99</strong> on any plan. New members only.</p>
              </div>

              <div className="signup-btns">
                <button className="signup-btn primary" onClick={() => setStep(2)}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 2: Vehicle Info */}
          {step === 2 && (
            <div className="signup-step-content">
              <h2 className="signup-title">Your Vehicle</h2>
              <p className="signup-desc">
                We need this to set up your <strong>{currentPlan.name}</strong> membership and verify at check-in.
              </p>

              <label className="signup-label">Vehicle Type</label>
              <div className="vehicle-types">
                {[
                  { type: "sedan", icon: "🚗", name: "Sedan / Coupe", extra: 0, priceLabel: "Standard price" },
                  { type: "suv", icon: "🚙", name: "SUV / Truck", extra: 5, priceLabel: "+$5.00/mo" },
                  { type: "van", icon: "🚐", name: "Minivan / Van", extra: 5, priceLabel: "+$5.00/mo" },
                ].map((v) => (
                  <div
                    key={v.type}
                    className={`v-type-card${vehicleType === v.type ? " selected" : ""}`}
                    onClick={() => selectVehicleType(v.type, v.extra)}
                  >
                    <div className="v-type-icon">{v.icon}</div>
                    <div className="v-type-name">{v.name}</div>
                    <div className={`v-type-price${vehicleType === v.type && v.extra > 0 ? " highlight" : ""}`}>
                      {v.priceLabel}
                    </div>
                  </div>
                ))}
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label className="signup-label">Make</label>
                  <select
                    className="signup-input"
                    value={form.make}
                    onChange={(e) => updateField("make", e.target.value)}
                  >
                    <option value="">Select make</option>
                    {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="field-group">
                  <label className="signup-label">Model</label>
                  <input
                    className="signup-input"
                    placeholder="e.g. Camry, Model 3"
                    value={form.model}
                    onChange={(e) => updateField("model", e.target.value)}
                  />
                </div>
              </div>
              <div className="field-row">
                <div className="field-group">
                  <label className="signup-label">Color</label>
                  <input
                    className="signup-input"
                    placeholder="e.g. White, Black"
                    value={form.color}
                    onChange={(e) => updateField("color", e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label className="signup-label">License Plate</label>
                  <input
                    className="signup-input"
                    placeholder="e.g. 7ABC123"
                    value={form.plate}
                    onChange={(e) => updateField("plate", e.target.value.toUpperCase())}
                    style={{ textTransform: "uppercase" }}
                  />
                </div>
              </div>

              <div className="signup-btns">
                <button className="signup-btn ghost" onClick={() => setStep(hasPreselectedPlan ? 1 : 1)}>
                  {hasPreselectedPlan ? (
                    <Link href="/#membership" style={{ color: "inherit", textDecoration: "none" }}>← Change Plan</Link>
                  ) : "← Back"}
                </button>
                <button className="signup-btn primary" onClick={() => setStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Personal Info */}
          {step === 3 && (
            <div className="signup-step-content">
              <h2 className="signup-title">Your Information</h2>
              <p className="signup-desc">We&rsquo;ll use this to set up your account and send your membership confirmation.</p>

              <div className="field-row">
                <div className="field-group">
                  <label className="signup-label">First Name</label>
                  <input className="signup-input" placeholder="John" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="signup-label">Last Name</label>
                  <input className="signup-input" placeholder="Smith" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
                </div>
              </div>
              <div className="field-group">
                <label className="signup-label">Email Address</label>
                <input className="signup-input" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
              </div>
              <div className="field-group">
                <label className="signup-label">Phone Number</label>
                <input className="signup-input" type="tel" placeholder="(310) 555-1234" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
              </div>

              <div className="signup-btns">
                <button className="signup-btn ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="signup-btn primary" onClick={() => setStep(4)}>Continue to Payment →</button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment */}
          {step === 4 && (
            <div className="signup-step-content">
              <h2 className="signup-title">Payment</h2>
              <p className="signup-desc">Secure checkout. Your card will be charged <strong>$14.99</strong> today.</p>

              {/* Card visual */}
              <div className="card-visual">
                <div className="card-chip" />
                <div className="card-number-display">
                  •••• •••• •••• {getLastFour()}
                </div>
                <div className="card-bottom-row">
                  <div>
                    <div className="card-meta-label">Card Holder</div>
                    <div className="card-meta-value">
                      {form.firstName || form.lastName ? `${form.firstName} ${form.lastName}`.trim() : "YOUR NAME"}
                    </div>
                  </div>
                  <div>
                    <div className="card-meta-label">Expires</div>
                    <div className="card-meta-value">{form.expiry || "MM/YY"}</div>
                  </div>
                </div>
              </div>

              <div className="card-fields">
                <div className="field-group" style={{ gridColumn: "span 2" }}>
                  <label className="signup-label">Card Number</label>
                  <input
                    className="signup-input"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={form.cardNumber}
                    onChange={(e) => updateField("cardNumber", formatCardNumber(e.target.value))}
                  />
                </div>
                <div className="field-group">
                  <label className="signup-label">Expiry</label>
                  <input
                    className="signup-input"
                    placeholder="MM / YY"
                    maxLength={7}
                    value={form.expiry}
                    onChange={(e) => updateField("expiry", formatExpiry(e.target.value))}
                  />
                </div>
                <div className="field-group">
                  <label className="signup-label">CVC</label>
                  <input
                    className="signup-input"
                    placeholder="123"
                    maxLength={4}
                    value={form.cvc}
                    onChange={(e) => updateField("cvc", e.target.value.replace(/\D/g, "").substring(0, 4))}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="summary-box">
                <div className="summary-row">
                  <span>{currentPlan.name} Plan</span>
                  <strong>${currentPlan.price.toFixed(2)}/mo</strong>
                </div>
                {surcharge > 0 && (
                  <div className="summary-row">
                    <span>SUV/Van surcharge</span>
                    <strong>+$5.00/mo</strong>
                  </div>
                )}
                <hr className="summary-divider" />
                <div className="summary-row">
                  <span>Monthly after trial</span>
                  <strong>${monthlyTotal.toFixed(2)}</strong>
                </div>
                <div className="summary-row summary-total-row">
                  <span>Due today</span>
                  <strong>${PROMO_PRICE.toFixed(2)}</strong>
                </div>
                <div className="summary-savings">
                  <span>✓ First month promo applied — you save ${savings.toFixed(2)}</span>
                </div>
              </div>

              <div className="signup-btns">
                <button className="signup-btn ghost" onClick={() => setStep(3)}>← Back</button>
                <button className="signup-btn gold" onClick={() => setStep(5)}>
                  Start Membership — $14.99 →
                </button>
              </div>

              <div className="secure-note">
                <span>🔒</span>
                <span>256-bit SSL encryption. Powered by Stripe.</span>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && (
            <div className="signup-step-content confirm-wrap">
              <div className="confirm-icon">✓</div>
              <h2 className="confirm-title">Welcome to Majestic!</h2>
              <p className="confirm-sub">
                Your membership is active. Drive in anytime —<br />
                just give us your name or plate number at check-in.
              </p>

              <div className="confirm-details">
                <h4>Membership Details</h4>
                <div className="confirm-row">
                  <span>Plan</span>
                  <strong>{currentPlan.name}</strong>
                </div>
                <div className="confirm-row">
                  <span>Vehicle</span>
                  <strong>{form.make} {form.model}</strong>
                </div>
                <div className="confirm-row">
                  <span>Plate</span>
                  <strong>{form.plate || "—"}</strong>
                </div>
                <div className="confirm-row">
                  <span>Charged today</span>
                  <strong className="gold-text">${PROMO_PRICE.toFixed(2)}</strong>
                </div>
                <div className="confirm-row">
                  <span>Next charge</span>
                  <strong>{getNextChargeDate()}</strong>
                </div>
              </div>

              <div className="signup-btns" style={{ justifyContent: "center" }}>
                <Link href="/" className="signup-btn primary" style={{ flex: "none", padding: "16px 40px", textDecoration: "none" }}>
                  Visit Majestic →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== PAGE WRAPPER WITH SUSPENSE ===== */
export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="signup-page">
        <div className="signup-bg" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px" }}>Loading...</div>
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}