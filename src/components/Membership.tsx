const plans = [
  {
    tier: "Essential",
    tierClass: "tier-b",
    checkClass: "ck-b",
    price: "34",
    cents: ".99/mo",
    note: "Unlimited exterior hand washes",
    features: [
      "Unlimited exterior foam hand wash",
      "Hand dry with chamois",
      "Tire & rim cleaning",
      "Exterior window wipe",
      "Free self-serve vacuum access",
    ],
    btnClass: "btn-tier-outline",
    btnText: "Get Essential",
  },
  {
    tier: "Premium",
    tierClass: "tier-g",
    checkClass: "ck-g",
    featured: true,
    price: "49",
    cents: ".99/mo",
    note: "Unlimited full-service hand washes",
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
  },
  {
    tier: "Ultimate",
    tierClass: "tier-r",
    checkClass: "ck-r",
    price: "64",
    cents: ".99/mo",
    note: "Unlimited full-service + monthly detail",
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
  },
];

export default function Membership() {
  return (
    <section className="membership" id="membership">
      <div className="membership-bg-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=1800&q=80" alt="" />
      </div>
      <div className="section-inner">
        <div className="reveal">
          <div className="section-label">Unlimited Memberships</div>
          <div className="section-title">
            Wash Anytime.
            <br />
            One Monthly Price.
          </div>
          <p className="section-sub">
            Join the club and wash your car as often as you want. No limits, no
            contracts, cancel anytime.
          </p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              className={`p-card reveal${plan.featured ? " featured" : ""}`}
              key={plan.tier}
            >
              {plan.featured && <div className="p-popular">Most Popular</div>}
              <div className={`p-tier ${plan.tierClass}`}>{plan.tier}</div>
              <div className="p-price">
                <span className="p-dollar">$</span>
                <span className="p-amount">{plan.price}</span>
                <span className="p-period">{plan.cents}</span>
              </div>
              <p className="p-note">{plan.note}</p>
              <ul className="p-list">
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className={`p-check ${plan.checkClass}`}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="#" className={`btn btn-tier ${plan.btnClass}`}>
                {plan.btnText}
              </a>
            </div>
          ))}
        </div>

        <div className="promo-strip reveal">
          <h4>🎉 First Month Just $14.99 on Any Plan</h4>
          <p>New members only. No contracts, cancel anytime. +$5/mo for SUV &amp; minivan.</p>
        </div>
      </div>
    </section>
  );
}