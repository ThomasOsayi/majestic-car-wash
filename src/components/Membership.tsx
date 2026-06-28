import RevealOnScroll from "./RevealOnScroll";
import { Gift } from "./Icons";

const JOIN_TEL = "tel:+13239337393";

export default function Membership() {
  return (
    <section className="membership" id="membership">
      <div className="membership-bg-img">
        <img src="/majestic/wash-menu-sign.jpg" alt="" />
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
              <span className="p-amount">19</span>
              <span className="p-period">.99/mo</span>
            </div>
            <p className="p-note">Member pricing &amp; perks</p>
            <ul className="p-list">
              <li><span className="p-check ck-b">✓</span> 20% off every wash &amp; detail service</li>
              <li><span className="p-check ck-b">✓</span> Free air freshener each visit</li>
              <li><span className="p-check ck-b">✓</span> Every 10th wash free</li>
              <li><span className="p-check ck-b">✓</span> Member-only text specials</li>
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
            <p className="p-note">2 washes included + bigger savings</p>
            <ul className="p-list">
              <li><span className="p-check ck-g">✓</span> Everything in Majestic Club, plus:</li>
              <li><span className="p-check ck-g">✓</span> 2 Silver Washes included each month</li>
              <li><span className="p-check ck-g">✓</span> 25% off additional washes &amp; details</li>
              <li><span className="p-check ck-g">✓</span> Member-only upgrades &amp; promotions</li>
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
              <li><span className="p-check ck-r">✓</span> 3 Silver Washes included each month</li>
              <li><span className="p-check ck-r">✓</span> 30% off everything else</li>
              <li><span className="p-check ck-r">✓</span> Free tire shine on every visit</li>
              <li><span className="p-check ck-r">✓</span> 1 guest wash pass each month</li>
            </ul>
            <a href={JOIN_TEL} className="btn btn-tier btn-tier-red">Call to Join</a>
          </RevealOnScroll>
        </div>

        <RevealOnScroll className="promo-strip">
          <h4><Gift /> Every 10th Wash Free on Every Plan</h4>
          <p>Call (323) 933-7393 to start your membership. No contracts, cancel anytime.</p>
        </RevealOnScroll>
      </div>
    </section>
  );
}