"use client";

import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const plans = [
  {
    tier: "Essential",
    tierClass: "tier-b",
    checkClass: "ck-b",
    monthly: 34.99,
    annual: 349.99,
    note: "Unlimited exterior hand washes",
    noteAnnual: "Unlimited exterior hand washes — billed yearly",
    features: [
      "Unlimited exterior foam hand wash",
      "Hand dry with chamois",
      "Tire & rim cleaning",
      "Exterior window wipe",
      "Free self-serve vacuum access",
    ],
    btnClass: "btn-tier-outline",
    btnText: "Get Essential",
    slug: "essential",
  },
  {
    tier: "Premium",
    tierClass: "tier-g",
    checkClass: "ck-g",
    featured: true,
    monthly: 49.99,
    annual: 499.99,
    note: "Unlimited full-service hand washes",
    noteAnnual: "Unlimited full-service hand washes — billed yearly",
    features: [
      "Everything in Essential",
      "Full interior vacuum",
      "Dashboard & console wipe",
      "Interior window cleaning",
      "Door jam cleaning",
      "Complimentary air freshener",
    ],
    btnClass: "btn-tier-gold",
    btnText: "Get Premium",
    slug: "premium",
  },
  {
    tier: "Ultimate",
    tierClass: "tier-r",
    checkClass: "ck-r",
    monthly: 64.99,
    annual: 649.99,
    note: "Unlimited full-service + monthly detail",
    noteAnnual: "Unlimited full-service + monthly detail — billed yearly",
    features: [
      "Everything in Premium",
      "Hand wax application",
      "Tire dressing & shine",
      "Monthly interior detail",
      "Leather / vinyl conditioning",
      "Priority service — skip the line",
    ],
    btnClass: "btn-tier-red",
    btnText: "Get Ultimate",
    slug: "ultimate",
  },
];

export default function Membership() {
  const [interval, setInterval] = useState<"monthly" | "annual">("monthly");

  return (
    <section className="membership" id="membership">
      <div className="membership-bg-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=1800&q=80" alt="" />
      </div>
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">Unlimited Memberships</div>
          <div className="section-title">
            Wash Anytime.
            <br />
            One {interval === "monthly" ? "Monthly" : "Annual"} Price.
          </div>
          <p className="section-sub">
            Join the club and wash your car as often as you want. No limits, no
            contracts, cancel anytime.
          </p>
        </RevealOnScroll>

        {/* Billing toggle */}
        <RevealOnScroll>
          <div className="billing-toggle-wrap">
            <div className="billing-toggle">
              <button
                className={`billing-toggle-btn${interval === "monthly" ? " active" : ""}`}
                onClick={() => setInterval("monthly")}
              >
                Monthly
              </button>
              <button
                className={`billing-toggle-btn${interval === "annual" ? " active" : ""}`}
                onClick={() => setInterval("annual")}
              >
                Annual
                <span className="billing-save-badge">Save 15%</span>
              </button>
            </div>
          </div>
        </RevealOnScroll>

        <div className="pricing-grid">
          {plans.map((plan, i) => {
            const price = interval === "monthly" ? plan.monthly : plan.annual;
            const perMonth = interval === "annual" ? (plan.annual / 12) : plan.monthly;
            const yearlySavings = interval === "annual" ? (plan.monthly * 12 - plan.annual) : 0;

            return (
              <RevealOnScroll
                className={`p-card${plan.featured ? " featured" : ""}`}
                delay={i * 150}
                key={plan.tier}
              >
                {plan.featured && <div className="p-popular">Most Popular</div>}
                <div className={`p-tier ${plan.tierClass}`}>{plan.tier}</div>
                <div className="p-price">
                  <span className="p-dollar">$</span>
                  {interval === "monthly" ? (
                    <>
                      <span className="p-amount">{String(plan.monthly).split(".")[0]}</span>
                      <span className="p-period">.{String(plan.monthly).split(".")[1]}/mo</span>
                    </>
                  ) : (
                    <>
                      <span className="p-amount">{String(plan.annual).split(".")[0]}</span>
                      <span className="p-period">.{String(plan.annual).split(".")[1]}/yr</span>
                    </>
                  )}
                </div>
                {interval === "annual" && (
                  <div className="p-annual-detail">
                    ${perMonth.toFixed(2)}/mo effective · Save ${yearlySavings.toFixed(2)}/yr
                  </div>
                )}
                <p className="p-note">{interval === "monthly" ? plan.note : plan.noteAnnual}</p>
                <ul className="p-list">
                  {plan.features.map((f) => (
                    <li key={f}>
                      <span className={`p-check ${plan.checkClass}`}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={`/signup?plan=${plan.slug}${interval === "annual" ? "&interval=annual" : ""}`}
                  className={`btn btn-tier ${plan.btnClass}`}
                >
                  {plan.btnText}
                </a>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll className="promo-strip" delay={200}>
          {interval === "monthly" ? (
            <>
              <h4>🎉 First Month Just $14.99 on Any Plan</h4>
              <p>New members only. No contracts, cancel anytime. +$5/mo for SUV &amp; minivan.</p>
            </>
          ) : (
            <>
              <h4>🎉 Save Up to $129/yr with Annual Billing</h4>
              <p>Pay once, wash all year. +$60/yr for SUV &amp; minivan. Cancel anytime.</p>
            </>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}