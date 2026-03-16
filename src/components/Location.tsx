export default function Location() {
  return (
    <section className="location" id="location">
      <div className="section-inner">
        <div className="reveal">
          <div className="section-label">Visit Us</div>
          <div className="section-title">
            Beverly Grove,
            <br />
            Los Angeles
          </div>
        </div>
        <div className="loc-grid">
          <div className="loc-map reveal">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3305.3!2d-118.364!3d34.072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2b92d4e7f5c5b%3A0x831ea8a3cc6e8af9!2sMajestic%20Car%20Wash!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              allowFullScreen
              loading="lazy"
              title="Majestic Car Wash location"
            ></iframe>
          </div>
          <div className="loc-info reveal">
            <div className="loc-item">
              <div className="loc-icon">📍</div>
              <div>
                <h4>Address</h4>
                <p>
                  8017 W 3rd Street
                  <br />
                  Los Angeles, CA 90048
                </p>
              </div>
            </div>
            <div className="loc-item">
              <div className="loc-icon">📞</div>
              <div>
                <h4>Phone</h4>
                <p>(323) 933-7393</p>
              </div>
            </div>
            <div className="loc-item">
              <div className="loc-icon">🕐</div>
              <div>
                <h4>Hours</h4>
                <p>
                  Mon – Sat: 8:00 AM – 6:00 PM
                  <br />
                  Sunday: 8:00 AM – 5:00 PM
                </p>
              </div>
            </div>
            <div className="loc-item">
              <div className="loc-icon">⛽</div>
              <div>
                <h4>Gas Station</h4>
                <p>
                  Shell fuel available on-site.
                  <br />
                  Fill up while we wash your car.
                </p>
              </div>
            </div>
            <div className="loc-cta">
              <h4>🚗 Drive In — No Appointment Needed</h4>
              <p>Walk-ins welcome 7 days a week. Members skip the line.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}