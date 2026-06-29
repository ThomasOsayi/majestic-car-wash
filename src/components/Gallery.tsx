import RevealOnScroll from "./RevealOnScroll";

export default function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">The Place</div>
          <div className="section-title">Real Photos.<br />Real Results.</div>
        </RevealOnScroll>
        <RevealOnScroll className="gallery-stack">
          <div className="g-full">
            <img src="/majestic/wash-menu-sign.jpg" alt="Diamond, Gold and Silver wash tiers with pricing" />
          </div>
          <div className="g-masonry">
            <div className="g-card">
              <img src="/majestic/service-menu-card.jpg" alt="Full wash and detail menu card" />
            </div>
            <div className="g-card">
              <img src="/majestic/detailing-bay.jpg" alt="Complete auto detailing in progress" />
            </div>
            <div className="g-card">
              <img src="/majestic/alacarte-board-1.jpg" alt="A la carte pricing: custom wash, rims, leather, dressings" />
            </div>
            <div className="g-card">
              <img src="/majestic/alacarte-board-2.jpg" alt="A la carte detail pricing: packages, exterior, interior" />
            </div>
          </div>
          <div className="g-full">
            <img src="/majestic/storefront.jpg" alt="Majestic Hand Car Wash neon storefront sign" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}