"use client";

import { useEffect, useRef, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();

          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} className="about-badge-num">{count}</span>;
}

export default function About() {
  return (
    <section className="about" id="about">
      <div className="section-inner">
        <RevealOnScroll>
          <div className="section-label">Our Story</div>
          <div className="section-title">
            42 Years. One Promise.
            <br />
            Your Car, Done Right.
          </div>
        </RevealOnScroll>
        <div className="about-grid">
          <RevealOnScroll className="about-images">
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
              <AnimatedCounter target={42} />
              <span className="about-badge-text">Years</span>
            </div>
          </RevealOnScroll>
          <RevealOnScroll className="about-text" delay={150}>
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
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}