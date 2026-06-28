import RevealOnScroll from "./RevealOnScroll";
import { Flag } from "./Icons";

const CARDS = [
  { n: "1", color: "var(--blue)", title: "Attention to Detail", source: "The hand-wash difference", text: "Every car gets individual attention, washed and finished by hand, never rushed through on brushes alone." },
  { n: "2", color: "var(--red)", title: "Reduced Risk of Paint Damage", source: "Gentler on your finish", text: "Hand washing reduces the risk of swirl marks and micro-scratches that harsh automated equipment can leave behind." },
  { n: "3", color: "var(--gold)", title: "Personalized Care", source: "Wash or full detail", text: "From a quick Silver wash to a complete detail, our crew tailors the care to your car, inside and out." },
];

export default function Reviews() {
  return (
    <section className="reviews-section" id="why">
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">Why Customers Choose Us</div>
          <div className="section-title">Hand Car Wash<br />Is Better.</div>
          <p className="section-sub">
            Three reasons drivers across Beverly Grove trust their cars to Majestic.
          </p>
          <div className="ph-note"><Flag /> Placeholder: swap in real Google &amp; Yelp reviews here before launch</div>
        </RevealOnScroll>
        <div className="reviews-grid">
          {CARDS.map((c) => (
            <RevealOnScroll className="rev-card" key={c.n}>
              <div className="rev-stars">★★★★★</div>
              <p className="rev-text">{c.text}</p>
              <div className="rev-author">
                <div className="rev-avatar-letter" style={{ background: c.color }}>{c.n}</div>
                <div>
                  <div className="rev-name">{c.title}</div>
                  <div className="rev-source">{c.source}</div>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
