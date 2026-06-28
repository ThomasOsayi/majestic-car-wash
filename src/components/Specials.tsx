import RevealOnScroll from "./RevealOnScroll";
import { Ticket, Books, Gift, Fuel } from "./Icons";

const COUPONS = [
  { amt: "$7", title: "Silver Wash w/ Sealer Wax", reg: "$32.99" },
  { amt: "$11", title: "Silver Wash w/ Under-Body Flush, Tire Dressing & Air Freshener", reg: "$40.99" },
  { amt: "$12", title: "Silver Wash w/ Rainbow Wax, Tire Dressing, Underbody Flush & Air Freshener", reg: "$46.99" },
  { amt: "$50", title: "Detail + Silver Wash w/ Meguiar's Hand Wax & Shampoo Seats or Carpet", reg: "$190.00" },
];

const SPECIALS = [
  { off: "$4 OFF", name: "Thursday Special", cond: "Silver wash just $25.99" },
  { off: "$6 OFF", name: "Senior Special", cond: "Thursdays only" },
  { off: "$3 OFF", name: "Uber / Lyft", cond: "With proof" },
  { off: "$3 OFF", name: "Student Special", cond: "With proof" },
];

export default function Specials() {
  return (
    <section className="deals" id="deals">
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">Coupons &amp; Specials</div>
          <div className="section-title">Save Every<br />Time You Visit</div>
          <p className="section-sub">
            Current Valpak offers, weekly specials, and ways to save when you wash with us.
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="coupon-grid">
          {COUPONS.map((c) => (
            <div className="coupon" key={c.amt + c.title}>
              <div className="coupon-amt"><span className="amt">{c.amt}</span><span className="off">OFF</span></div>
              <div className="coupon-body">
                <h4>{c.title}</h4>
                <div className="reg">Regularly <s>{c.reg}</s></div>
              </div>
            </div>
          ))}
          <p className="coupon-fine">Must present Valpak ad for all offers. Call or visit for details. Offers expire 4/30/26.</p>
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
        <RevealOnScroll className="perks-grid">
          <div className="perk">
            <div className="perk-ic"><Ticket /></div>
            <h5>Frequent Wash Card</h5>
            <p>Buy 10 washes, get the next one free. We punch your card every visit.</p>
          </div>
          <div className="perk">
            <div className="perk-ic"><Books /></div>
            <h5>Wash Books (10-Pack)</h5>
            <p>Save about $2.50 per wash when you buy a book of 10.</p>
            <div className="perk-prices">
              <span>Blue (Silver) <b>$274.90</b></span>
              <span>Yellow (Gold) <b>$324.90</b></span>
              <span>Pink (Diamond) <b>$374.90</b></span>
            </div>
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
