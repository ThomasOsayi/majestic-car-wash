import RevealOnScroll from "./RevealOnScroll";
import { Pin, Phone, Clock, Fuel, Car } from "./Icons";

export default function Location() {
  return (
    <section className="location" id="location">
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">Find Us</div>
          <div className="section-title">Beverly Grove,<br />Los Angeles</div>
        </RevealOnScroll>
        <div className="loc-grid">
          <RevealOnScroll className="loc-map">
            <iframe
              src="https://www.google.com/maps?q=8017+W+3rd+St,+Los+Angeles,+CA+90048&output=embed"
              allowFullScreen
              loading="lazy"
              title="Majestic Car Wash location"
            />
          </RevealOnScroll>
          <RevealOnScroll className="loc-info">
            <div className="loc-item">
              <div className="loc-icon"><Pin /></div>
              <div>
                <h4>Address</h4>
                <p>8017 W 3rd Street<br />Los Angeles, CA 90048</p>
              </div>
            </div>
            <div className="loc-item">
              <div className="loc-icon"><Phone /></div>
              <div>
                <h4>Phone</h4>
                <p>(323) 933-7393</p>
              </div>
            </div>
            <div className="loc-item">
              <div className="loc-icon"><Clock /></div>
              <div>
                <h4>Hours</h4>
                <p>Open 7 Days a Week<br />8:00 AM to 5:00 PM</p>
              </div>
            </div>
            <div className="loc-item">
              <div className="loc-icon"><Fuel /></div>
              <div>
                <h4>Gas Station</h4>
                <p>Shell fuel available on-site.<br />Fill up while we wash your car.</p>
              </div>
            </div>
            <div className="loc-cta">
              <h4><Car /> Drive In, No Appointment Needed</h4>
              <p>Walk-ins welcome 7 days a week. Ask about Majestic Club member pricing.</p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
