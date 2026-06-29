import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src="/majestic/detailing-bay.jpg" alt="Crew hand-washing a car at Majestic" />
      </div>
      <div className="hero-content">
        <div className="hero-tag">
          <span className="dot" /> Beverly Grove • Open 7 Days 8AM to 5PM
        </div>
        <h1>
          The <span className="red">Hand Wash</span>
          <br />Your Car
          <br />Deserves.
        </h1>
        <p className="hero-desc">
          <strong>100% hand wash, hand-finished by our crew every time.</strong> Attention
          to detail, reduced risk of paint damage, personalized care. Washes from $29.99
          and complete details done right. One block west of Fairfax.
        </p>
        <div className="hero-btns">
          <Link href="/menu" className="btn btn-red">See the Full Menu →</Link>
          <Link href="/deals" className="btn btn-glass">Coupons &amp; Specials</Link>
        </div>
        <div className="hero-photo-strip">
          <div className="hero-thumb"><img src="/majestic/storefront.jpg" alt="Majestic storefront" /></div>
          <div className="hero-thumb"><img src="/majestic/wash-menu-sign.jpg" alt="Wash menu sign" /></div>
          <div className="hero-thumb"><img src="/majestic/service-menu-card.jpg" alt="Service menu" /></div>
          <div className="hero-thumb"><img src="/majestic/alacarte-board-1.jpg" alt="A la carte board" /></div>
          <a href="#about" className="hero-thumb-more"><span>+</span>Photos</a>
        </div>
      </div>
    </section>
  );
}
