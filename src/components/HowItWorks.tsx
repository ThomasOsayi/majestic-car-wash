import RevealOnScroll from "./RevealOnScroll";

const STEPS = [
  { n: "1", h: "Pick your tier", p: "Majestic Club, Club Plus, or Club Elite. Choose the savings that fit how often you wash." },
  { n: "2", h: "Sign up", p: "Enroll online or at the wash in seconds. No contracts, no commitment." },
  { n: "3", h: "Show your code", p: "Flash your member code each visit for member pricing, perks, and included washes." },
  { n: "4", h: "Cancel anytime", p: "Change tiers or cancel whenever you like. Your call, no hassle." },
];

export default function HowItWorks() {
  return (
    <section style={{ background: "var(--white)" }}>
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">How It Works</div>
          <div className="section-title">Join in Under<br />a Minute.</div>
        </RevealOnScroll>
        <RevealOnScroll className="steps-grid">
          {STEPS.map((s) => (
            <div className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h4>{s.h}</h4>
              <p>{s.p}</p>
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
