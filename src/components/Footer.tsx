import Link from "next/link";
import { Instagram, Facebook, Phone } from "./Icons";

export default function Footer() {
  return (
    <>
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Majestic Car Wash</h3>
            <p>
              Beverly Grove&apos;s hand car wash and complete auto detailing. 100% hand
              wash, personalized care, and Shell gas on-site. One block west of Fairfax.
            </p>
          </div>
          <div className="footer-col">
            <h4>The Menu</h4>
            <Link href="/menu">Silver Wash $29.99</Link>
            <Link href="/menu">Gold Wash $34.99</Link>
            <Link href="/menu">Diamond Wash $39.99</Link>
            <Link href="/menu">Detailing Services</Link>
            <Link href="/menu">À La Carte</Link>
          </div>
          <div className="footer-col">
            <h4>Save</h4>
            <Link href="/deals">Valpak Coupons</Link>
            <Link href="/deals">Thursday Special</Link>
            <Link href="/deals">Wash Books</Link>
            <Link href="/membership">Membership Tiers</Link>
            <a href="tel:+13239337393">Call to Join</a>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="https://www.instagram.com/majesticcarwash8017/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.facebook.com/majesticcarwash/" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.yelp.com/biz/majestic-car-wash-los-angeles" target="_blank" rel="noopener noreferrer">Yelp</a>
            <a href="https://g.co/kgs/majesticcarwash" target="_blank" rel="noopener noreferrer">Google Maps</a>
          </div>
        </div>
        <div className="footer-bar">
          <div className="footer-bar-left">
            <p>© 2026 Majestic Car Wash. 8017 W 3rd St, Los Angeles, CA 90048 · (323) 933-7393</p>
            <div className="footer-legal-links">
              <Link href="/terms">Terms</Link>
              <span>·</span>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
          <div className="footer-bar-right">
            <div className="footer-socials">
              <a href="https://www.instagram.com/majesticcarwash8017/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram /></a>
              <a href="https://www.facebook.com/majesticcarwash/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook /></a>
              <a href="tel:3239337393" aria-label="Call"><Phone /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    {/* Mobile-only sticky action bar (CSS hides it on desktop) */}
    <div className="mobile-cta-bar">
      <a className="mobile-cta-call" href="tel:+13239337393" aria-label="Call Majestic Car Wash">
        <Phone />
      </a>
      <Link className="mobile-cta-join" href="/membership">Join the Club &rarr;</Link>
    </div>
    </>
  );
}