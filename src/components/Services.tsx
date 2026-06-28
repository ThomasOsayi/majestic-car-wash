import RevealOnScroll from "./RevealOnScroll";
import { Calendar, StarSolid, Gem } from "./Icons";

const DETAIL = [
  { name: "Hand Wash (No Tunnel)", price: "$50", up: true, desc: "Full hand wash, vacuum, wipe all inside, clean all windows, towel-dry exterior, door jams & trunk, wheel brightener, tire shine." },
  { name: "Super Clean", price: "$69.99", up: true, desc: "Silver wash, clean door panels & seats, extra vacuum, exterior dressing, air freshener, wipe all inside, shampoo floor mats." },
  { name: "Hand & Wax", price: "$69.99", up: true, desc: "Silver wash, carnauba paste wax, wheel brightener, tire shine." },
  { name: "Seats or Carpet Shampoo", price: "$120", up: true, desc: "Silver wash, carpet or seat shampoo, 4 mats, tire shine, air freshener." },
  { name: "Interior Shampoo", price: "$149.99", up: true, desc: "Silver wash, shampoo everything inside (dashboard, doors, seats, trunk & carpet mats), leather treatment, tire shine, air freshener." },
  { name: "Clay & Wax", price: "$150.99", up: true, desc: "Silver wash, clay oxidation removal & overspray, carnauba wax, tire dressing, air freshener." },
  { name: "Exterior Detail", price: "$249.99", up: true, desc: "Custom polish, remove oxidation, water spots, tar & overspray, buffing & wax, exterior dressing, wheel brightener." },
  { name: "Int. & Ext. Package: Complete Detail", price: "$349.99", up: true, desc: "The works, inside and out. Extra for SUVs, minivans, vans & trucks. Mats $3 each & up." },
];

const ALACARTE = [
  ["Custom Wash", "$39.99 & up"],
  ["Rims", "$20.99 & up"],
  ["Leather Treatment", "$49.00 & up"],
  ["Interior Dressing", "$30.00"],
  ["Exterior Dressing", "$15.00"],
  ["Tire Dressing", "$5.00"],
  ["Headlights", "$49.99 & up"],
  ["Floor Mats", "$3.00 each & up"],
];

export default function Services() {
  return (
    <section className="menu" id="menu">
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">The Menu</div>
          <div className="section-title">Pick Your Wash.<br />Or the Full Detail.</div>
          <p className="section-sub">
            Three hand-wash tiers plus a complete detail menu. Every package starts with a
            100% hand wash.
          </p>
        </RevealOnScroll>

        <RevealOnScroll className="menu-sub-label" as="div">Hand Wash Packages</RevealOnScroll>
        <RevealOnScroll className="wash-grid">
          <div className="wash-card">
            <div className="wash-head silver">
              <h3>SILVER</h3>
              <div className="wash-tag">The essential hand wash</div>
              <div className="wash-price">$29.99</div>
            </div>
            <div className="wash-body">
              <ul>
                <li><span className="wc">✓</span> 100% Hand Wash</li>
                <li><span className="wc">✓</span> Foaming Presoak</li>
                <li><span className="wc">✓</span> Spot-Free Rinse</li>
                <li><span className="wc">✓</span> Vacuum</li>
                <li><span className="wc">✓</span> Wipe Down Dashboard &amp; Cup Holders</li>
                <li><span className="wc">✓</span> Clean Windows</li>
              </ul>
            </div>
            <div className="wash-foot">
              <span className="wash-thursday"><Calendar /> Thursday Special $25.99</span>
            </div>
          </div>

          <div className="wash-card">
            <div className="wash-head gold">
              <h3>GOLD</h3>
              <div className="wash-tag">Shine &amp; protection added</div>
              <div className="wash-price">$34.99</div>
            </div>
            <div className="wash-body">
              <ul>
                <li><span className="wc">✓</span> Everything in Silver</li>
                <li><span className="wc">✓</span> Triple Shine (Wax Protection)</li>
                <li><span className="wc">✓</span> Blazin&apos; Glaze</li>
                <li><span className="wc">✓</span> Tire Dressing</li>
                <li><span className="wc">✓</span> Air Freshener</li>
                <li><span className="wc">✓</span> Turbo Dry</li>
              </ul>
            </div>
            <div className="wash-foot">
              <span className="wash-thursday" style={{ background: "rgba(212,32,44,0.08)", color: "var(--red)", borderColor: "rgba(212,32,44,0.25)" }}>
                <StarSolid /> Most popular wash
              </span>
            </div>
          </div>

          <div className="wash-card">
            <div className="wash-head diamond">
              <h3>DIAMOND</h3>
              <div className="wash-tag">The full-protection wash</div>
              <div className="wash-price">$39.99</div>
            </div>
            <div className="wash-body">
              <ul>
                <li><span className="wc">✓</span> Everything in Gold</li>
                <li><span className="wc">✓</span> Fire: Clean &amp; Protect</li>
                <li><span className="wc">✓</span> Ice: Instant Shine</li>
                <li><span className="wc">✓</span> Exterior Dressing</li>
                <li><span className="wc">✓</span> Spot-Free Rinse &amp; Turbo Dry</li>
              </ul>
            </div>
            <div className="wash-foot">
              <span className="wash-thursday" style={{ background: "rgba(27,63,160,0.08)", color: "var(--blue)", borderColor: "rgba(27,63,160,0.25)" }}>
                <Gem /> Top-tier protection
              </span>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="menu-sub-label" as="div">Detailing Services</RevealOnScroll>
        <RevealOnScroll className="detail-grid">
          {DETAIL.map((d) => (
            <div className="detail-row" key={d.name}>
              <div className="detail-row-top">
                <h4>{d.name}</h4>
                <div className="detail-price">{d.price}{d.up && <small> &amp; up</small>}</div>
              </div>
              <p>{d.desc}</p>
            </div>
          ))}
        </RevealOnScroll>

        <RevealOnScroll className="alacarte">
          <h3>À La Carte</h3>
          <p className="ac-note">Add any single service to your wash.</p>
          <div className="ac-list">
            {ALACARTE.map(([name, price]) => (
              <div className="ac-item" key={name}>
                <span>{name}</span><b>{price}</b>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
