export default function About() {
  return (
    <section className="about" id="about">
      <div className="section-inner">
        <div className="reveal">
          <div className="section-label">Our Story</div>
          <div className="section-title">
            42 Years. One Promise.
            <br />
            Your Car, Done Right.
          </div>
        </div>
        <div className="about-grid">
          <div className="about-images reveal">
            <div className="about-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&q=80" alt="Hand washing car" />
            </div>
            <div className="about-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&q=80" alt="Clean car detail" />
            </div>
            <div className="about-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=500&q=80" alt="Car interior" />
            </div>
            <div className="about-badge">
              <span className="about-badge-num">42</span>
              <span className="about-badge-text">Years</span>
            </div>
          </div>
          <div className="about-text reveal">
            <h3>Machines Can&apos;t Do What Hands Can</h3>
            <p>
              Automated car washes use spinning brushes and plastic strips that
              leave micro-scratches on your paint, dulling your finish over time.
              At Majestic, every single vehicle is washed by hand using foam mitts
              and microfiber towels — the way it should be.
            </p>
            <p>
              Our team doesn&apos;t just spray and rinse. They inspect, they scrub,
              they detail. Tree sap, bird droppings, road tar — if it&apos;s on
              your car, we get it off without damaging your clear coat.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <span className="about-feature-icon">🖐️</span>
                <span>100% Hand Wash —<br />No Machines</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">🛡️</span>
                <span>Scratch-Free<br />Guarantee</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">🧹</span>
                <span>Full Interior<br />Included</span>
              </div>
              <div className="about-feature">
                <span className="about-feature-icon">⛽</span>
                <span>Shell Gas<br />On-Site</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}