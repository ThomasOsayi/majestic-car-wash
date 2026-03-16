export default function CtaBand() {
  return (
    <section className="cta-band">
      <div className="cta-band-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1449130609150-52d934d30e85?w=1800&q=80" alt="" />
      </div>
      <div className="cta-band-content reveal">
        <h2>Ready for the Cleanest Car on Your Block?</h2>
        <p>
          Join our unlimited membership and never worry about a dirty car again.
          Your first month is just $14.99.
        </p>
        <a href="#membership" className="btn btn-white">
          Start Your Membership →
        </a>
      </div>
    </section>
  );
}