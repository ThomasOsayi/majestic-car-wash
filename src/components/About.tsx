import RevealOnScroll from "./RevealOnScroll";
import { Hand, Shield, Sparkles, Fuel } from "./Icons";

export default function About() {
  return (
    <section className="about" id="about">
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">Why Majestic</div>
          <div className="section-title">
            Hand Car Wash<br />Is Simply Better.
          </div>
        </RevealOnScroll>
        <div className="about-grid">
          <RevealOnScroll className="about-images">
            <div className="about-col">
              <div className="about-img">
                <img src="/majestic/detailing-bay.jpg" alt="Complete auto detailing in our bay" />
              </div>
            </div>
            <div className="about-col">
              <div className="about-img">
                <img src="/majestic/storefront.jpg" alt="Majestic Hand Car Wash neon storefront sign" />
              </div>
            </div>
            <div className="about-badge">
              <span className="about-badge-num" style={{ fontSize: 26 }}>100%</span>
              <span className="about-badge-text">Hand Wash</span>
            </div>
          </RevealOnScroll>
          <RevealOnScroll className="about-text">
            <h3>Real Care, By Hand</h3>
            <p>
              Every vehicle is washed 100% by hand and finished by our crew: foaming
              presoak, hand wash, spot-free rinse, and a careful towel and turbo dry.
              It&apos;s a level of attention an automated tunnel alone can&apos;t match.
            </p>
            <p>
              Beyond the wash, we&apos;re a full detail shop: clay and wax, interior shampoo,
              seats and carpet, exterior detail, and complete int. &amp; ext. packages. Fuel
              up at the on-site Shell while we take care of your car.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <span className="about-feature-icon"><Hand /></span>
                <span>100% Hand Wash<br />&amp; Hand-Finished</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon"><Shield /></span>
                <span>Reduced Risk of<br />Paint Damage</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon"><Sparkles /></span>
                <span>Complete Auto<br />Detailing</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon"><Fuel /></span>
                <span>Shell Gas<br />On-Site</span>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
