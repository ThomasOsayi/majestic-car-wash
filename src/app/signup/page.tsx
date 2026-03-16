"use client";

import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { createMember } from "@/lib/firestore";

/* ===== DATA ===== */
const PLANS: Record<string, { name: string; price: number; desc: string }> = {
  essential: { name: "Essential", price: 34.99, desc: "Unlimited exterior hand wash" },
  premium: { name: "Premium", price: 49.99, desc: "Unlimited full-service hand wash" },
  ultimate: { name: "Ultimate", price: 64.99, desc: "Full-service + monthly detail" },
};

const PROMO_PRICE = 14.99;

interface CarMake {
  name: string;
  icon: string;
  popular: boolean;
  models: string[];
}

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

/* ===== SIGNUP FORM COMPONENT ===== */
function SignupForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");

  const hasPreselectedPlan = planParam && PLANS[planParam];
  const initialStep = hasPreselectedPlan ? 2 : 1;

  const [step, setStep] = useState(initialStep);
  const [plan, setPlan] = useState(planParam && PLANS[planParam] ? planParam : "premium");
  const [vehicleType, setVehicleType] = useState("sedan");
  const [surcharge, setSurcharge] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [form, setForm] = useState({
    make: "", model: "", color: "", plate: "",
    firstName: "", lastName: "", email: "", phone: "",
    cardNumber: "", expiry: "", cvc: "",
  });

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
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setMakeDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function selectVehicleType(type: string, extra: number) {
    setVehicleType(type);
    setSurcharge(extra);
  }

  function selectMake(make: CarMake) {
    setSelectedMakeObj(make);
    updateField("make", make.name);
    updateField("model", "");
    setMakeQuery("");
    setMakeDropdownOpen(false);
  }

  function clearMake() {
    setSelectedMakeObj(null);
    updateField("make", "");
    updateField("model", "");
    setMakeQuery("");
  }

  function selectModel(model: string) {
    updateField("model", model);
  }

  const filteredMakes = makeQuery.length === 0
    ? CAR_MAKES
    : CAR_MAKES.filter((m) => m.name.toLowerCase().includes(makeQuery.toLowerCase()));

  const popularMakes = filteredMakes.filter((m) => m.popular);
  const otherMakes = filteredMakes.filter((m) => !m.popular);
  const showPopularHeader = makeQuery.length < 2 && popularMakes.length > 0;

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

  /* ===== SUBMIT TO FIRESTORE ===== */
  async function handleSubmitMembership() {
    if (submitting) return;
    setSubmitting(true);

    try {
      const nextBilling = getNextChargeDate();
      const memberSince = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });

      const id = await createMember({
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
        nextBilling,
      });

      setMemberId(id);
      localStorage.setItem("memberId", id);
      setStep(5);
    } catch (error) {
      console.error("Failed to create member:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-bg" />

      <div className="signup-topbar">
        <Link href="/" className="signup-logo">
          <div className="signup-logo-icon">M</div>
          <span>Majestic Car Wash</span>
        </Link>
        <Link href="/" className="signup-back">← Back to site</Link>
      </div>

      <div className="signup-container">
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

          {/* STEP 1: Plan Selection */}
          {step === 1 && !hasPreselectedPlan && (
            <div className="signup-step-content">
              <h2 className="signup-title">Choose Your Plan</h2>
              <p className="signup-desc">Unlimited hand washes, one monthly price. Cancel anytime.</p>
              <div className="plan-options">
                {Object.entries(PLANS).map(([key, p]) => (
                  <div key={key} className={`plan-option${plan === key ? " selected" : ""}`} onClick={() => setPlan(key)}>
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
                  <div key={v.type} className={`v-type-card${vehicleType === v.type ? " selected" : ""}`} onClick={() => selectVehicleType(v.type, v.extra)}>
                    <div className="v-type-icon">{v.icon}</div>
                    <div className="v-type-name">{v.name}</div>
                    <div className={`v-type-price${vehicleType === v.type && v.extra > 0 ? " highlight" : ""}`}>{v.priceLabel}</div>
                  </div>
                ))}
              </div>

              <label className="signup-label">Make &amp; Model</label>

              {selectedMakeObj && (
                <div className="make-badge">
                  <div className="make-badge-logo">{selectedMakeObj.icon}</div>
                  <div className="make-badge-info">
                    <div className="make-badge-name">{selectedMakeObj.name}</div>
                    <div className="make-badge-sub">Pick your model below</div>
                  </div>
                  <button className="make-badge-clear" onClick={clearMake}>✕</button>
                </div>
              )}

              {!selectedMakeObj && (
                <div className="make-search-wrap" ref={searchWrapRef}>
                  <div className="make-search-icon">🔍</div>
                  <input
                    type="text"
                    className="make-search-input"
                    placeholder="Type your car brand... e.g. Tesla, BMW, Toyota"
                    value={makeQuery}
                    onChange={(e) => { setMakeQuery(e.target.value); setMakeDropdownOpen(true); }}
                    onFocus={() => setMakeDropdownOpen(true)}
                  />
                  {makeDropdownOpen && (
                    <div className="make-dropdown">
                      {filteredMakes.length === 0 ? (
                        <div className="make-dropdown-empty">No match found. Type the full make name.</div>
                      ) : (
                        <>
                          {showPopularHeader && <div className="make-dropdown-section">Popular in Beverly Grove</div>}
                          {(showPopularHeader ? popularMakes : filteredMakes).map((m) => (
                            <div key={m.name} className="make-dropdown-item" onClick={() => selectMake(m)}>
                              <div className="make-dropdown-item-logo">{m.icon}</div>
                              <div className="make-dropdown-item-text">
                                <div className="make-dropdown-item-name">{m.name}</div>
                                <div className="make-dropdown-item-meta">{m.models.slice(0, 3).join(", ")}...</div>
                              </div>
                            </div>
                          ))}
                          {showPopularHeader && otherMakes.length > 0 && (
                            <>
                              <div className="make-dropdown-section">All Brands</div>
                              {otherMakes.map((m) => (
                                <div key={m.name} className="make-dropdown-item" onClick={() => selectMake(m)}>
                                  <div className="make-dropdown-item-logo">{m.icon}</div>
                                  <div className="make-dropdown-item-text">
                                    <div className="make-dropdown-item-name">{m.name}</div>
                                    <div className="make-dropdown-item-meta">{m.models.slice(0, 3).join(", ")}...</div>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {selectedMakeObj && (
                <div className="model-chips-section">
                  <div className="model-chips">
                    {selectedMakeObj.models.map((m) => (
                      <div key={m} className={`model-chip${form.model === m ? " selected" : ""}`} onClick={() => selectModel(m)}>{m}</div>
                    ))}
                  </div>
                  <div className="model-other-row">
                    <span className="model-other-label">or type:</span>
                    <input
                      type="text"
                      className="model-other-input"
                      placeholder="Other model..."
                      value={selectedMakeObj.models.includes(form.model) ? "" : form.model}
                      onChange={(e) => updateField("model", e.target.value)}
                      onFocus={() => { if (selectedMakeObj.models.includes(form.model)) updateField("model", ""); }}
                    />
                  </div>
                </div>
              )}

              <div className="field-row" style={{ marginTop: "24px" }}>
                <div className="field-group">
                  <label className="signup-label">Color</label>
                  <input className="signup-input" placeholder="e.g. White, Black, Silver" value={form.color} onChange={(e) => updateField("color", e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="signup-label">License Plate</label>
                  <input className="signup-input" placeholder="e.g. 7ABC123" value={form.plate} onChange={(e) => updateField("plate", e.target.value.toUpperCase())} style={{ textTransform: "uppercase" }} />
                </div>
              </div>

              <div className="signup-btns">
                <button className="signup-btn ghost" onClick={() => hasPreselectedPlan ? window.location.href = "/#membership" : setStep(1)}>
                  ← {hasPreselectedPlan ? "Change Plan" : "Back"}
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
              <div className="card-visual">
                <div className="card-chip" />
                <div className="card-number-display">•••• •••• •••• {getLastFour()}</div>
                <div className="card-bottom-row">
                  <div>
                    <div className="card-meta-label">Card Holder</div>
                    <div className="card-meta-value">{form.firstName || form.lastName ? `${form.firstName} ${form.lastName}`.trim() : "YOUR NAME"}</div>
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
                  <input className="signup-input" placeholder="1234 5678 9012 3456" maxLength={19} value={form.cardNumber} onChange={(e) => updateField("cardNumber", formatCardNumber(e.target.value))} />
                </div>
                <div className="field-group">
                  <label className="signup-label">Expiry</label>
                  <input className="signup-input" placeholder="MM / YY" maxLength={7} value={form.expiry} onChange={(e) => updateField("expiry", formatExpiry(e.target.value))} />
                </div>
                <div className="field-group">
                  <label className="signup-label">CVC</label>
                  <input className="signup-input" placeholder="123" maxLength={4} value={form.cvc} onChange={(e) => updateField("cvc", e.target.value.replace(/\D/g, "").substring(0, 4))} />
                </div>
              </div>
              <div className="summary-box">
                <div className="summary-row"><span>{currentPlan.name} Plan</span><strong>${currentPlan.price.toFixed(2)}/mo</strong></div>
                {surcharge > 0 && <div className="summary-row"><span>SUV/Van surcharge</span><strong>+$5.00/mo</strong></div>}
                <hr className="summary-divider" />
                <div className="summary-row"><span>Monthly after trial</span><strong>${monthlyTotal.toFixed(2)}</strong></div>
                <div className="summary-row summary-total-row"><span>Due today</span><strong>${PROMO_PRICE.toFixed(2)}</strong></div>
                <div className="summary-savings"><span>✓ First month promo applied — you save ${savings.toFixed(2)}</span></div>
              </div>
              <div className="signup-btns">
                <button className="signup-btn ghost" onClick={() => setStep(3)} disabled={submitting}>← Back</button>
                <button
                  className="signup-btn gold"
                  onClick={handleSubmitMembership}
                  disabled={submitting}
                  style={submitting ? { opacity: 0.6, cursor: "not-allowed" } : {}}
                >
                  {submitting ? "Creating membership..." : "Start Membership — $14.99 →"}
                </button>
              </div>
              <div className="secure-note"><span>🔒</span><span>256-bit SSL encryption. Powered by Stripe.</span></div>
            </div>
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && (
            <div className="signup-step-content confirm-wrap">
              <div className="confirm-icon">✓</div>
              <h2 className="confirm-title">Welcome to Majestic!</h2>
              <p className="confirm-sub">Your membership is active. Drive in anytime —<br />just give us your name or plate number at check-in.</p>
              <div className="confirm-details">
                <h4>Membership Details</h4>
                <div className="confirm-row"><span>Plan</span><strong>{currentPlan.name}</strong></div>
                <div className="confirm-row"><span>Vehicle</span><strong>{form.make} {form.model}</strong></div>
                <div className="confirm-row"><span>Plate</span><strong>{form.plate || "—"}</strong></div>
                <div className="confirm-row"><span>Charged today</span><strong className="gold-text">${PROMO_PRICE.toFixed(2)}</strong></div>
                <div className="confirm-row"><span>Next charge</span><strong>{getNextChargeDate()}</strong></div>
                {memberId && (
                  <div className="confirm-row"><span>Member ID</span><strong style={{ fontSize: "12px", opacity: 0.5 }}>{memberId}</strong></div>
                )}
              </div>
              <div className="signup-btns" style={{ justifyContent: "center" }}>
                <Link href="/" className="signup-btn primary" style={{ flex: "none", padding: "16px 40px", textDecoration: "none" }}>Visit Majestic →</Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

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