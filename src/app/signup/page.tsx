"use client";

import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createMember } from "@/lib/firestore";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/* ===== DATA ===== */
const PLANS: Record<string, { name: string; price: number; desc: string }> = {
  essential: { name: "Essential", price: 34.99, desc: "Unlimited exterior hand wash" },
  premium: { name: "Premium", price: 49.99, desc: "Unlimited full-service hand wash" },
  ultimate: { name: "Ultimate", price: 64.99, desc: "Full-service + monthly detail" },
};

const PROMO_PRICE = 14.99;

interface CarMake { name: string; icon: string; popular: boolean; models: string[]; }

const CAR_MAKES: CarMake[] = [
  { name: "Tesla", icon: "⚡", popular: true, models: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"] },
  { name: "BMW", icon: "🔵", popular: true, models: ["3 Series", "5 Series", "X3", "X5", "M3", "M5"] },
  { name: "Mercedes-Benz", icon: "⭐", popular: true, models: ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "AMG GT"] },
  { name: "Toyota", icon: "🔴", popular: true, models: ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Prius"] },
  { name: "Honda", icon: "🔴", popular: true, models: ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Odyssey"] },
  { name: "Porsche", icon: "🏁", popular: true, models: ["911", "Cayenne", "Macan", "Taycan", "Panamera"] },
  { name: "Lexus", icon: "💎", popular: true, models: ["IS", "ES", "RX", "NX", "GX", "LC"] },
  { name: "Audi", icon: "⚪", popular: true, models: ["A4", "A6", "Q5", "Q7", "e-tron", "RS 5"] },
  { name: "Ford", icon: "🔵", popular: false, models: ["F-150", "Mustang", "Bronco", "Explorer", "Escape", "Maverick"] },
  { name: "Chevrolet", icon: "🟡", popular: false, models: ["Camaro", "Corvette", "Silverado", "Equinox", "Tahoe", "Malibu"] },
  { name: "Hyundai", icon: "🔷", popular: false, models: ["Sonata", "Elantra", "Tucson", "Santa Fe", "Palisade", "Ioniq 5"] },
  { name: "Kia", icon: "🔷", popular: false, models: ["K5", "Sportage", "Telluride", "Forte", "EV6", "Sorento"] },
  { name: "Nissan", icon: "⚪", popular: false, models: ["Altima", "Sentra", "Rogue", "Pathfinder", "Z", "Frontier"] },
  { name: "Volkswagen", icon: "🔵", popular: false, models: ["Jetta", "Golf", "Tiguan", "Atlas", "ID.4", "Passat"] },
  { name: "Subaru", icon: "⭐", popular: false, models: ["Outback", "Forester", "Crosstrek", "WRX", "Impreza", "Ascent"] },
  { name: "Jeep", icon: "🟢", popular: false, models: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Gladiator"] },
  { name: "Dodge", icon: "🔴", popular: false, models: ["Charger", "Challenger", "Durango", "Hornet"] },
  { name: "Ram", icon: "⚫", popular: false, models: ["1500", "2500", "3500", "ProMaster"] },
  { name: "Land Rover", icon: "🟢", popular: false, models: ["Range Rover", "Defender", "Discovery", "Evoque", "Velar"] },
  { name: "Volvo", icon: "⚪", popular: false, models: ["XC90", "XC60", "XC40", "S60", "S90", "EX30"] },
  { name: "Mazda", icon: "🔵", popular: false, models: ["CX-5", "CX-50", "Mazda3", "CX-90", "MX-5 Miata"] },
  { name: "Genesis", icon: "🔶", popular: false, models: ["G70", "G80", "G90", "GV70", "GV80", "GV60"] },
  { name: "Rivian", icon: "🟢", popular: false, models: ["R1T", "R1S", "R2"] },
  { name: "Acura", icon: "⚪", popular: false, models: ["TLX", "MDX", "RDX", "Integra", "ZDX"] },
  { name: "Infiniti", icon: "⚪", popular: false, models: ["Q50", "Q60", "QX50", "QX60", "QX80"] },
  { name: "Cadillac", icon: "🔶", popular: false, models: ["CT5", "Escalade", "Lyriq", "XT5", "XT6"] },
  { name: "Lincoln", icon: "⚫", popular: false, models: ["Navigator", "Aviator", "Corsair", "Nautilus"] },
  { name: "Buick", icon: "⚪", popular: false, models: ["Enclave", "Encore", "Envision"] },
  { name: "Mini", icon: "🔴", popular: false, models: ["Cooper", "Countryman", "Clubman"] },
  { name: "Jaguar", icon: "🟢", popular: false, models: ["F-Pace", "E-Pace", "F-Type", "XF"] },
  { name: "Chrysler", icon: "🔵", popular: false, models: ["300", "Pacifica"] },
  { name: "GMC", icon: "🔴", popular: false, models: ["Sierra", "Yukon", "Terrain", "Acadia", "Canyon", "Hummer EV"] },
];

/* ===== PAYMENT FORM COMPONENT ===== */
function PaymentForm({ onSuccess, onBack, planName, monthlyTotal, surcharge, promo, savings }: {
  onSuccess: () => void;
  onBack: () => void;
  planName: string;
  monthlyTotal: number;
  surcharge: number;
  promo: number;
  savings: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState("");

  async function handlePay() {
    if (!stripe || !elements || processing) return;
    setProcessing(true);
    setPayError("");

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setPayError(error.message || "Payment failed. Please try again.");
      setProcessing(false);
    } else {
      onSuccess();
    }
  }

  return (
    <div className="signup-step-content">
      <h2 className="signup-title">Payment</h2>
      <p className="signup-desc">Complete your membership payment securely.</p>

      <div className="summary-box" style={{ marginBottom: "24px" }}>
        <div className="summary-row"><span>{planName} Plan</span><strong>${(monthlyTotal - surcharge).toFixed(2)}/mo</strong></div>
        {surcharge > 0 && <div className="summary-row"><span>SUV/Van surcharge</span><strong>+$5.00/mo</strong></div>}
        <hr className="summary-divider" />
        <div className="summary-row"><span>Monthly after trial</span><strong>${monthlyTotal.toFixed(2)}/mo</strong></div>
        <div className="summary-row summary-total-row"><span>Due today</span><strong>${promo.toFixed(2)}</strong></div>
        <div className="summary-savings"><span>✓ First month promo — you save ${savings.toFixed(2)}</span></div>
      </div>

      <div className="stripe-element-wrap">
        <PaymentElement options={{
          layout: "tabs",
          wallets: { applePay: "auto", googlePay: "auto" },
        }} />
      </div>

      {payError && <div className="login-error" style={{ marginTop: "16px" }}>{payError}</div>}

      <div className="signup-btns" style={{ marginTop: "24px" }}>
        <button className="signup-btn ghost" onClick={onBack} disabled={processing}>← Back</button>
        <button
          className="signup-btn gold"
          onClick={handlePay}
          disabled={!stripe || processing}
          style={processing ? { opacity: 0.6, cursor: "not-allowed" } : {}}
        >
          {processing ? "Processing payment..." : `Pay $${promo.toFixed(2)} — Start Membership`}
        </button>
      </div>
      <div className="secure-note"><span>🔒</span><span>Secure payment powered by Stripe. Your card info never touches our server.</span></div>
    </div>
  );
}

/* ===== SIGNUP FORM ===== */
function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planParam = searchParams.get("plan");
  const hasPreselectedPlan = planParam && PLANS[planParam];
  const initialStep = hasPreselectedPlan ? 2 : 1;

  const [step, setStep] = useState(initialStep);
  const [plan, setPlan] = useState(planParam && PLANS[planParam] ? planParam : "premium");
  const [vehicleType, setVehicleType] = useState("sedan");
  const [surcharge, setSurcharge] = useState(0);
  const [form, setForm] = useState({
    make: "", model: "", color: "", plate: "",
    firstName: "", lastName: "", email: "", phone: "",
    password: "", confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Stripe state
  const [clientSecret, setClientSecret] = useState("");
  const [stripeCustomerId, setStripeCustomerId] = useState("");
  const [stripeSubscriptionId, setStripeSubscriptionId] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);

  // Make search state
  const [makeQuery, setMakeQuery] = useState("");
  const [makeDropdownOpen, setMakeDropdownOpen] = useState(false);
  const [selectedMakeObj, setSelectedMakeObj] = useState<CarMake | null>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const currentPlan = PLANS[plan];
  const monthlyTotal = currentPlan.price + surcharge;
  const savings = monthlyTotal - PROMO_PRICE;

  const steps = hasPreselectedPlan
    ? [{ num: 1, label: "Vehicle" }, { num: 2, label: "Info" }, { num: 3, label: "Payment" }]
    : [{ num: 1, label: "Plan" }, { num: 2, label: "Vehicle" }, { num: 3, label: "Info" }, { num: 4, label: "Payment" }];

  const totalSteps = steps.length;
  const stepIndex = hasPreselectedPlan ? step - 1 : step;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) setMakeDropdownOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "password" || field === "confirmPassword") setPasswordError("");
  }

  function selectVehicleType(type: string, extra: number) { setVehicleType(type); setSurcharge(extra); }
  function selectMake(make: CarMake) { setSelectedMakeObj(make); updateField("make", make.name); updateField("model", ""); setMakeQuery(""); setMakeDropdownOpen(false); }
  function clearMake() { setSelectedMakeObj(null); updateField("make", ""); updateField("model", ""); setMakeQuery(""); }
  function selectModel(model: string) { updateField("model", model); }

  const filteredMakes = makeQuery.length === 0 ? CAR_MAKES : CAR_MAKES.filter((m) => m.name.toLowerCase().includes(makeQuery.toLowerCase()));
  const popularMakes = filteredMakes.filter((m) => m.popular);
  const otherMakes = filteredMakes.filter((m) => !m.popular);
  const showPopularHeader = makeQuery.length < 2 && popularMakes.length > 0;

  function getNextChargeDate() {
    const d = new Date(); d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  async function validateAndGoToPayment() {
    if (form.password.length < 6) { setPasswordError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirmPassword) { setPasswordError("Passwords don't match."); return; }
    setPasswordError("");
    setLoadingPayment(true);

    try {
      // Create incomplete subscription and get client secret
      const res = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan, firstName: form.firstName, lastName: form.lastName,
          email: form.email, phone: form.phone, vehicleType,
          make: form.make, model: form.model, color: form.color,
          plate: form.plate, surcharge,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set up payment");

      setClientSecret(data.clientSecret);
      setStripeCustomerId(data.customerId);
      setStripeSubscriptionId(data.subscriptionId);
      setStep(4);
    } catch (error: any) {
      console.error("Payment setup failed:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoadingPayment(false);
    }
  }

  async function handlePaymentSuccess() {
    setCreatingAccount(true);

    try {
      // Create Firebase Auth user
      let authUid = "";
      try {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        authUid = cred.user.uid;
      } catch (authErr: any) {
        if (authErr.code !== "auth/email-already-in-use") console.error("Auth creation failed:", authErr);
      }

      // Create member in Firestore
      const memberSince = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
      const memberId = await createMember({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        plan: plan as "essential" | "premium" | "ultimate",
        planName: currentPlan.name,
        price: currentPlan.price,
        status: "active",
        vehicleType: vehicleType as "sedan" | "suv" | "van",
        make: form.make,
        model: form.model,
        color: form.color,
        plate: form.plate.toUpperCase(),
        surcharge,
        memberSince,
        nextBilling: getNextChargeDate(),
        stripeCustomerId,
        stripeSubscriptionId,
        authUid,
      });

      localStorage.setItem("memberId", memberId);
      setStep(5);
    } catch (err: any) {
      console.error("Account creation failed:", err);
      // Payment succeeded but account creation failed — still show success
      // since they're charged. They can log in later.
      setStep(5);
    } finally {
      setCreatingAccount(false);
    }
  }

  const elementsOptions = clientSecret ? {
    clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#D4202C",
        colorBackground: "#1A1714",
        colorText: "#FFFFFF",
        colorDanger: "#FF2D3B",
        borderRadius: "12px",
        fontFamily: "Outfit, sans-serif",
      },
      rules: {
        ".Input": { border: "1px solid rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.04)" },
        ".Input:focus": { border: "1px solid #D4202C", boxShadow: "0 0 0 3px rgba(212,32,44,0.15)" },
        ".Label": { color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: "600" },
        ".Tab": { border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)" },
        ".Tab--selected": { border: "1px solid #D4202C", backgroundColor: "rgba(212,32,44,0.08)" },
      },
    },
  } : undefined;

  return (
    <div className="signup-page">
      <div className="signup-bg" />
      <div className="signup-topbar">
        <Link href="/" className="signup-logo"><div className="signup-logo-icon">M</div><span>Majestic Car Wash</span></Link>
        <Link href="/" className="signup-back">← Back to site</Link>
      </div>

      <div className="signup-container">
        {step <= totalSteps && (
          <div className="signup-progress">
            {steps.map((s, i) => (
              <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
                <div className="signup-progress-step">
                  <div className={`signup-dot${stepIndex > i + 1 ? " done" : stepIndex === i + 1 ? " active" : ""}`}>{stepIndex > i + 1 ? "✓" : i + 1}</div>
                  <span className={`signup-step-label${stepIndex > i + 1 ? " done" : stepIndex === i + 1 ? " active" : ""}`}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (<div className="signup-line"><div className={`signup-line-fill${stepIndex > i + 1 ? " filled" : ""}`} /></div>)}
              </div>
            ))}
          </div>
        )}

        <div className="signup-card">

          {/* STEP 1: Plan */}
          {step === 1 && !hasPreselectedPlan && (
            <div className="signup-step-content">
              <h2 className="signup-title">Choose Your Plan</h2>
              <p className="signup-desc">Unlimited hand washes, one monthly price. Cancel anytime.</p>
              <div className="plan-options">
                {Object.entries(PLANS).map(([key, p]) => (
                  <div key={key} className={`plan-option${plan === key ? " selected" : ""}`} onClick={() => setPlan(key)}>
                    {key === "premium" && <div className="plan-badge-tag">Most Popular</div>}
                    <div className="plan-radio"><div className="plan-radio-dot" /></div>
                    <div className="plan-info"><div className="plan-name">{p.name}</div><div className="plan-detail">{p.desc}</div></div>
                    <div className="plan-price-col"><div className="plan-price-main">${p.price.toFixed(2)}</div><div className="plan-price-period">per month</div></div>
                  </div>
                ))}
              </div>
              <div className="promo-note-box"><span>🎉</span><p>First month just <strong>$14.99</strong> on any plan. New members only.</p></div>
              <div className="signup-btns"><button className="signup-btn primary" onClick={() => setStep(2)}>Continue →</button></div>
            </div>
          )}

          {/* STEP 2: Vehicle */}
          {step === 2 && (
            <div className="signup-step-content">
              <h2 className="signup-title">Your Vehicle</h2>
              <p className="signup-desc">We need this to set up your <strong>{currentPlan.name}</strong> membership and verify at check-in.</p>

              <label className="signup-label">Vehicle Type</label>
              <div className="vehicle-types">
                {[
                  { type: "sedan", icon: "🚗", name: "Sedan / Coupe", extra: 0, priceLabel: "Standard price" },
                  { type: "suv", icon: "🚙", name: "SUV / Truck", extra: 5, priceLabel: "+$5.00/mo" },
                  { type: "van", icon: "🚐", name: "Minivan / Van", extra: 5, priceLabel: "+$5.00/mo" },
                ].map((v) => (
                  <div key={v.type} className={`v-type-card${vehicleType === v.type ? " selected" : ""}`} onClick={() => selectVehicleType(v.type, v.extra)}>
                    <div className="v-type-icon">{v.icon}</div><div className="v-type-name">{v.name}</div>
                    <div className={`v-type-price${vehicleType === v.type && v.extra > 0 ? " highlight" : ""}`}>{v.priceLabel}</div>
                  </div>
                ))}
              </div>

              <label className="signup-label">Make &amp; Model</label>
              {selectedMakeObj && (
                <div className="make-badge"><div className="make-badge-logo">{selectedMakeObj.icon}</div><div className="make-badge-info"><div className="make-badge-name">{selectedMakeObj.name}</div><div className="make-badge-sub">Pick your model below</div></div><button className="make-badge-clear" onClick={clearMake}>✕</button></div>
              )}
              {!selectedMakeObj && (
                <div className="make-search-wrap" ref={searchWrapRef}>
                  <div className="make-search-icon">🔍</div>
                  <input type="text" className="make-search-input" placeholder="Type your car brand... e.g. Tesla, BMW, Toyota" value={makeQuery} onChange={(e) => { setMakeQuery(e.target.value); setMakeDropdownOpen(true); }} onFocus={() => setMakeDropdownOpen(true)} />
                  {makeDropdownOpen && (
                    <div className="make-dropdown">
                      {filteredMakes.length === 0 ? (<div className="make-dropdown-empty">No match found.</div>) : (<>
                        {showPopularHeader && <div className="make-dropdown-section">Popular in Beverly Grove</div>}
                        {(showPopularHeader ? popularMakes : filteredMakes).map((m) => (
                          <div key={m.name} className="make-dropdown-item" onClick={() => selectMake(m)}><div className="make-dropdown-item-logo">{m.icon}</div><div className="make-dropdown-item-text"><div className="make-dropdown-item-name">{m.name}</div><div className="make-dropdown-item-meta">{m.models.slice(0, 3).join(", ")}...</div></div></div>
                        ))}
                        {showPopularHeader && otherMakes.length > 0 && (<><div className="make-dropdown-section">All Brands</div>{otherMakes.map((m) => (
                          <div key={m.name} className="make-dropdown-item" onClick={() => selectMake(m)}><div className="make-dropdown-item-logo">{m.icon}</div><div className="make-dropdown-item-text"><div className="make-dropdown-item-name">{m.name}</div><div className="make-dropdown-item-meta">{m.models.slice(0, 3).join(", ")}...</div></div></div>
                        ))}</>)}
                      </>)}
                    </div>
                  )}
                </div>
              )}
              {selectedMakeObj && (
                <div className="model-chips-section">
                  <div className="model-chips">{selectedMakeObj.models.map((m) => (<div key={m} className={`model-chip${form.model === m ? " selected" : ""}`} onClick={() => selectModel(m)}>{m}</div>))}</div>
                  <div className="model-other-row"><span className="model-other-label">or type:</span><input type="text" className="model-other-input" placeholder="Other model..." value={selectedMakeObj.models.includes(form.model) ? "" : form.model} onChange={(e) => updateField("model", e.target.value)} onFocus={() => { if (selectedMakeObj.models.includes(form.model)) updateField("model", ""); }} /></div>
                </div>
              )}
              <div className="field-row" style={{ marginTop: "24px" }}>
                <div className="field-group"><label className="signup-label">Color</label><input className="signup-input" placeholder="e.g. White, Black, Silver" value={form.color} onChange={(e) => updateField("color", e.target.value)} /></div>
                <div className="field-group"><label className="signup-label">License Plate</label><input className="signup-input" placeholder="e.g. 7ABC123" value={form.plate} onChange={(e) => updateField("plate", e.target.value.toUpperCase())} style={{ textTransform: "uppercase" }} /></div>
              </div>
              <div className="signup-btns">
                <button className="signup-btn ghost" onClick={() => hasPreselectedPlan ? window.location.href = "/#membership" : setStep(1)}>← {hasPreselectedPlan ? "Change Plan" : "Back"}</button>
                <button className="signup-btn primary" onClick={() => setStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Info + Password */}
          {step === 3 && (
            <div className="signup-step-content">
              <h2 className="signup-title">Your Information</h2>
              <p className="signup-desc">We&rsquo;ll use this to set up your account and send your membership confirmation.</p>
              <div className="field-row">
                <div className="field-group"><label className="signup-label">First Name</label><input className="signup-input" placeholder="John" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} /></div>
                <div className="field-group"><label className="signup-label">Last Name</label><input className="signup-input" placeholder="Smith" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} /></div>
              </div>
              <div className="field-group"><label className="signup-label">Email Address</label><input className="signup-input" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} /></div>
              <div className="field-group"><label className="signup-label">Phone Number</label><input className="signup-input" type="tel" placeholder="(310) 555-1234" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} /></div>
              <div style={{ marginTop: "8px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <label className="signup-label">Create a Password</label>
                <p className="signup-desc" style={{ marginBottom: "14px", fontSize: "13px" }}>You&rsquo;ll use this to log into your member dashboard.</p>
                <div className="field-row">
                  <div className="field-group"><label className="signup-label">Password</label><input className="signup-input" type="password" placeholder="At least 6 characters" value={form.password} onChange={(e) => updateField("password", e.target.value)} /></div>
                  <div className="field-group"><label className="signup-label">Confirm Password</label><input className="signup-input" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} /></div>
                </div>
                {passwordError && <div className="login-error" style={{ marginTop: "8px" }}>{passwordError}</div>}
              </div>
              <div className="signup-btns">
                <button className="signup-btn ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="signup-btn primary" onClick={validateAndGoToPayment} disabled={loadingPayment} style={loadingPayment ? { opacity: 0.6 } : {}}>
                  {loadingPayment ? "Setting up payment..." : "Continue to Payment →"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Embedded Stripe Payment */}
          {step === 4 && clientSecret && elementsOptions && (
            <Elements stripe={stripePromise} options={elementsOptions}>
              <PaymentForm
                onSuccess={handlePaymentSuccess}
                onBack={() => setStep(3)}
                planName={currentPlan.name}
                monthlyTotal={monthlyTotal}
                surcharge={surcharge}
                promo={PROMO_PRICE}
                savings={savings}
              />
            </Elements>
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && (
            <div className="signup-step-content confirm-wrap">
              {creatingAccount ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--red)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>Setting up your account...</div>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <>
                  <div className="confirm-icon">✓</div>
                  <h2 className="confirm-title">Welcome to Majestic!</h2>
                  <p className="confirm-sub">Your membership is active and your payment is confirmed.<br />Drive in anytime — just give us your name or show your QR code.</p>
                  <div className="confirm-details">
                    <h4>Membership Details</h4>
                    <div className="confirm-row"><span>Plan</span><strong>{currentPlan.name}</strong></div>
                    <div className="confirm-row"><span>Vehicle</span><strong>{form.make} {form.model}</strong></div>
                    <div className="confirm-row"><span>Plate</span><strong>{form.plate || "—"}</strong></div>
                    <div className="confirm-row"><span>Charged today</span><strong className="gold-text">${PROMO_PRICE.toFixed(2)}</strong></div>
                    <div className="confirm-row"><span>Next charge</span><strong>{getNextChargeDate()}</strong></div>
                    <div className="confirm-row"><span>Monthly rate</span><strong>${monthlyTotal.toFixed(2)}/mo</strong></div>
                  </div>
                  <div className="signup-btns" style={{ justifyContent: "center", gap: "12px" }}>
                    <Link href="/member" className="signup-btn gold" style={{ textDecoration: "none", flex: "none", padding: "16px 32px" }}>View My Dashboard →</Link>
                    <Link href="/" className="signup-btn ghost" style={{ textDecoration: "none", flex: "none", padding: "16px 32px" }}>Back to Majestic</Link>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="signup-page"><div className="signup-bg" /><div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}><div style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px" }}>Loading...</div></div></div>}>
      <SignupForm />
    </Suspense>
  );
}