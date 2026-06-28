"use client";

import RevealOnScroll from "./RevealOnScroll";
import { Flag } from "./Icons";

export default function ContactForm() {
  return (
    <section style={{ background: "var(--white)" }} id="contact">
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">Get In Touch</div>
          <div className="section-title">Drop Us a Line</div>
        </RevealOnScroll>
        <RevealOnScroll className="contact-wrap">
          <div className="contact-intro">
            <h3>Questions? Quotes? Big detail job?</h3>
            <p>
              Call us at <strong>(323) 933-7393</strong> or stop by. We&apos;re open 7 days a
              week, 8AM to 5PM, one block west of Fairfax. For detail estimates, send a few
              photos of your vehicle and we&apos;ll get right back to you.
            </p>
            <p>8017 W 3rd Street<br />Los Angeles, CA 90048</p>
          </div>
          <div>
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="cf-row">
                <div className="cf-field"><label>Name</label><input type="text" placeholder="Your name" /></div>
                <div className="cf-field"><label>Phone</label><input type="tel" placeholder="(323) 000-0000" /></div>
              </div>
              <div className="cf-field"><label>Email</label><input type="email" placeholder="you@email.com" /></div>
              <div className="cf-field">
                <label>How can we help?</label>
                <textarea placeholder="Tell us about your vehicle or the service you're after..." />
              </div>
              <button type="submit" className="btn btn-red">Send Message →</button>
              <p className="contact-note"><Flag /> Mockup form. Wire to email / CRM before launch.</p>
            </form>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
