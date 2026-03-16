"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <div className="nav-logo-img">M</div>
          <span className="nav-logo-text">Majestic Car Wash</span>
        </a>
        <div className="nav-links">
          <a href="#about" onClick={(e) => scrollTo(e, "#about")}>About</a>
          <a href="#services" onClick={(e) => scrollTo(e, "#services")}>Services</a>
          <a href="#membership" onClick={(e) => scrollTo(e, "#membership")}>Membership</a>
          <a href="#gallery" onClick={(e) => scrollTo(e, "#gallery")}>Gallery</a>
          <a href="#reviews" onClick={(e) => scrollTo(e, "#reviews")}>Reviews</a>
          <a href="#location" onClick={(e) => scrollTo(e, "#location")}>Location</a>
          <Link href="/login" className="nav-member-login">Member Login</Link>
          <a href="#membership" className="nav-join" onClick={(e) => scrollTo(e, "#membership")}>Join Now</a>
        </div>
      </div>
    </nav>
  );
}