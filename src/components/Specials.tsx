import RevealOnScroll from "./RevealOnScroll";
import { Ticket, Books, Gift, Fuel, Clock } from "./Icons";

const COUPONS = [
  { amt: "$7", title: "Silver Wash w/ Sealer Wax", reg: "$34.99" },
];

const SPECIALS = [
  { off: "$4 OFF", name: "Thursday Special", cond: "Full Service Wash just $27.99" },
  { off: "$7 OFF", name: "Senior Special", cond: "Full Service Wash just $24.99" },
  { off: "$3 OFF", name: "Student Special", cond: "Full Service Wash just $28.99" },
  { off: "$3 OFF", name: "Uber / Lyft", cond: "Full Service Wash just $28.99" },
];

export default function Specials() {
  return (
    <section className="deals" id="deals">
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">Coupons &amp; Specials</div>
          <div className="section-title">Save Every<br />Time You Visit</div>
          <p className="section-sub">
            Current offers, weekly specials, and ways to save when you wash with us.
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="coupon-grid coupon-grid-single">
          {COUPONS.map((c) => (
            <div className="coupon" key={c.amt + c.title}>
              <div className="coupon-amt"><span className="amt">{c.amt}</span><span className="off">OFF</span></div>
              <div className="coupon-body">
                <h4>{c.title}</h4>
                <div className="reg">Regularly <s>{c.reg}</s></div>
              </div>
            </div>
          ))}
          <p className="coupon-fine">
            One coupon per customer. Cannot be combined with other offers. We also accept
            competitor coupons, honored at our Thursday Special price of $27.99, first visit only.
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="menu-sub-label" as="div">Weekly Specials</RevealOnScroll>
        <RevealOnScroll className="specials-row">
          {SPECIALS.map((s) => (
            <div className="special-pill" key={s.name}>
              <div className="sp-off">{s.off}</div>
              <div className="sp-name">{s.name}</div>
              <div className="sp-cond">{s.cond}</div>
            </div>
          ))}
        </RevealOnScroll>

        <RevealOnScroll className="menu-sub-label" as="div">Ways to Save More</RevealOnScroll>
        <RevealOnScroll className="perks-grid perks-grid-5">
          <div className="perk">
            <div className="perk-ic"><Ticket /></div>
            <h5>Frequent Wash Card</h5>
            <p>Ask the cashier for your card. We punch it every visit, and your reward wash is on us.</p>
          </div>
          <div className="perk">
            <div className="perk-ic"><Books /></div>
            <h5>Wash Books (10-Pack)</h5>
            <p>Save $2.50 per wash when you buy a book of 10.</p>
            <div className="perk-prices">
              <span>Blue (Silver) <b>$294.90</b></span>
              <span>Yellow (Gold) <b>$344.90</b></span>
              <span>Pink (Diamond) <b>$394.90</b></span>
            </div>
          </div>
          <div className="perk">
            <div className="perk-ic"><Clock /></div>
            <h5>Rain Checks</h5>
            <p>Weather turn on you right after a wash? Ask for a rain check and come back for a fresh one.</p>
          </div>
          <div className="perk">
            <div className="perk-ic"><Gift /></div>
            <h5>Gift Certificates</h5>
            <p>Available for car wash services. Cannot be combined with coupons.</p>
          </div>
          <div className="perk">
            <div className="perk-ic"><Fuel /></div>
            <h5>Gas Discount</h5>
            <p>Save 10¢/gal on Shell fuel when you purchase a wash (top-off / fill-up only).</p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
