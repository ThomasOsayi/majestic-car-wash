import RevealOnScroll from "./RevealOnScroll";

export default function Gallery() {
  return (
    <section className="gallery" id="gallery">
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">The Place</div>
          <div className="section-title">Real Photos.<br />Real Results.</div>
        </RevealOnScroll>
        <RevealOnScroll className="gallery-mosaic">
          <div className="gallery-cell gc-wide">
            <img src="/majestic/wash-menu-sign.jpg" alt="Diamond, Gold and Silver wash menu sign" />
          </div>
          <div className="gallery-cell">
            <img src="/majestic/storefront.jpg" alt="Majestic Hand Car Wash storefront" />
          </div>
          <div className="gallery-cell">
            <img src="/majestic/service-menu-card.jpg" alt="Full service and detail menu" />
          </div>
          <div className="gallery-cell">
            <img src="/majestic/alacarte-board-1.jpg" alt="A la carte pricing board" />
          </div>
          <div className="gallery-cell gc-wide">
            <img src="/majestic/detailing-bay.jpg" alt="Complete auto detailing in progress" />
          </div>
          <div className="gallery-cell">
            <img src="/majestic/alacarte-board-2.jpg" alt="Detail package pricing board" />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
