import RevealOnScroll from "./RevealOnScroll";
import { Ticket } from "./Icons";

const JOIN_TEL = "tel:+13239337393";

export default function Membership() {
  return (
    <section className="membership" id="membership">
      <div className="membership-bg-img">
        <img src="/majestic/storefront.jpg" alt="" />
      </div>
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">Membership</div>
          <div className="section-title">Three Tiers.<br />Built for Loyalty.</div>
          <p className="section-sub">
            Not an unlimited model. Members pay a low monthly fee for member pricing, perks,
            and real savings, and still pay less per wash. No contracts, cancel anytime.
          </p>
        </RevealOnScroll>

        <div className="pricing-grid">
          {/* MAJESTIC CLUB */}
          <RevealOnScroll className="p-card">
            <div className="p-tier tier-b">Majestic Club</div>
            <div className="p-price">
              <span className="p-dollar">$</span>
              <span className="p-amount">24</span>
              <span className="p-period">.99/mo</span>
            </div>
            <p className="p-note">Member pricing &amp; perks</p>
            <ul className="p-list">
              <li><span className="p-check ck-b">✓</span> 10% off every wash &amp; detail service</li>
              <li><span className="p-check ck-b">✓</span> Free air freshener each visit</li>
              <li><span className="p-check ck-b">✓</span> No contracts, cancel anytime</li>
            </ul>
            <a href={JOIN_TEL} className="btn btn-tier btn-tier-outline">Call to Join</a>
          </RevealOnScroll>

          {/* MAJESTIC CLUB PLUS */}
          <RevealOnScroll className="p-card featured">
            <div className="p-popular">Most Popular</div>
            <div className="p-tier tier-g">Majestic Club Plus</div>
            <div className="p-price">
              <span className="p-dollar">$</span>
              <span className="p-amount">44</span>
              <span className="p-period">.99/mo</span>
            </div>
            <p className="p-note">1 wash included + bigger savings</p>
            <ul className="p-list">
              <li><span className="p-check ck-g">✓</span> Everything in Majestic Club, plus:</li>
              <li><span className="p-check ck-g">✓</span> 1 Full Service Wash included each month</li>
              <li><span className="p-check ck-g">✓</span> 15% off additional washes &amp; details</li>
            </ul>
            <a href={JOIN_TEL} className="btn btn-tier btn-tier-gold">Call to Join</a>
          </RevealOnScroll>

          {/* MAJESTIC CLUB ELITE */}
          <RevealOnScroll className="p-card">
            <div className="p-tier tier-r">Majestic Club Elite</div>
            <div className="p-price">
              <span className="p-dollar">$</span>
              <span className="p-amount">89</span>
              <span className="p-period">.99/mo</span>
            </div>
            <p className="p-note">Most washes + best savings</p>
            <ul className="p-list">
              <li><span className="p-check ck-r">✓</span> Everything in Club Plus, plus:</li>
              <li><span className="p-check ck-r">✓</span> 2 Full Service Washes included each month</li>
              <li><span className="p-check ck-r">✓</span> 20% off everything else</li>
              <li><span className="p-check ck-r">✓</span> Free tire shine on every visit</li>
            </ul>
            <a href={JOIN_TEL} className="btn btn-tier btn-tier-red">Call to Join</a>
          </RevealOnScroll>
        </div>

        <RevealOnScroll className="promo-strip">
          <h4><Ticket /> Frequent Wash Cards Available to Everyone</h4>
          <p>Ask the cashier for your card on your next visit. Call (323) 933-7393 to start a membership. No contracts, cancel anytime.</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
