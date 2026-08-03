import Link from "next/link";
import RevealOnScroll from "./RevealOnScroll";

export default function CtaBand() {
  return (
    <section className="cta-band">
      <div className="cta-band-bg">
        <img src="/majestic/detailing-bay.jpg" alt="" />
      </div>
      <RevealOnScroll className="cta-band-content">
        <h2>Wash More. Pay Less.</h2>
        <p>
          Join Majestic Club for member pricing on every wash and detail.
          No contracts, cancel anytime.
        </p>
        <Link href="/membership" className="btn btn-white">
          See Membership Tiers →
        </Link>
      </RevealOnScroll>
    </section>
  );
}
