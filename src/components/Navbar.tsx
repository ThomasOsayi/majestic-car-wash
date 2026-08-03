"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/membership", label: "Membership" },
  { href: "/deals", label: "Deals" },
  { href: "/contact", label: "Contact" },
];

const PHONE_TEL = "tel:+13239337393";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-img">M</div>
            <span className="nav-logo-text">Majestic Car Wash</span>
          </Link>

          <div className="nav-links">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={pathname === l.href ? "nav-active" : undefined}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/membership" className="nav-join">Join Now</Link>
          </div>

          <button
            type="button"
            className="nav-burger"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile full-screen drawer */}
      <div className={`nav-drawer${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open}>
        <div className="nav-drawer-head">
          <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
            <div className="nav-logo-img">M</div>
            <span className="nav-logo-text">Majestic Car Wash</span>
          </Link>
          <button
            type="button"
            className="nav-drawer-close"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            &times;
          </button>
        </div>

        <nav className="nav-drawer-links">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "active" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav-drawer-cta">
          <Link href="/membership" className="btn btn-red" onClick={() => setOpen(false)}>
            Join Now
          </Link>
          <a className="nav-drawer-call" href={PHONE_TEL}>
            Call (323) 933-7393 &middot; Mon–Sat 8AM–6PM · Sun 8AM–5PM
          </a>
        </div>
      </div>
    </>
  );
}