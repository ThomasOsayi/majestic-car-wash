"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const y = window.scrollY;
        bgRef.current.style.transform = `translateY(${y * 0.35}px) scale(1.1)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="hero">
      <div className="hero-bg" ref={bgRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1800&q=80"
          alt="Car being washed"
        />
      </div>
      <div className="hero-content">
        <div className="hero-tag">
          <span className="dot"></span> Beverly Grove Since 1984 — Family Owned
        </div>
        <h1>
          The <span className="red">Hand Wash</span>
          <br />
          Your Car
          <br />
          Deserves.
        </h1>
        <p className="hero-desc">
          <strong>No machines. No shortcuts. No swirl marks.</strong> Real people
          who care, washing every car by hand for over 40 years. Unlimited
          memberships starting at $34.99/mo. First month just $14.99.
        </p>
        <div className="hero-btns">
          <a href="#membership" className="btn btn-red">
            View Membership Plans →
          </a>
          <a href="#services" className="btn btn-glass">
            Explore Services
          </a>
        </div>
        <div className="hero-photo-strip">
          <div className="hero-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=200&q=80" alt="" />
          </div>
          <div className="hero-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&q=80" alt="" />
          </div>
          <div className="hero-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=200&q=80" alt="" />
          </div>
          <div className="hero-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=200&q=80" alt="" />
          </div>
          <div className="hero-thumb-more">
            <span>42+</span>Photos
          </div>
        </div>
      </div>
    </section>
  );
}