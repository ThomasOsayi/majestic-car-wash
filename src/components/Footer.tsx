import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Majestic Car Wash</h3>
            <p>
              Beverly Grove&apos;s trusted hand car wash since 1984. Family owned,
              community loved, and committed to making your car look its absolute
              best.
            </p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <a href="#services">Exterior Hand Wash</a>
            <a href="#services">Full-Service Wash</a>
            <a href="#services">Premium Detail</a>
            <a href="#services">Paint Protection</a>
            <a href="#services">Sap Removal</a>
          </div>
          <div className="footer-col">
            <h4>Membership</h4>
            <a href="#membership">Essential Plan</a>
            <a href="#membership">Premium Plan</a>
            <a href="#membership">Ultimate Plan</a>
            <a href="#membership">First Month $14.99</a>
            <Link href="/login">Member Login</Link>
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
            <p>© 2025 Majestic Car Wash. All rights reserved. 8017 W 3rd St, Los Angeles, CA 90048</p>
            <div className="footer-legal-links">
              <Link href="/terms">Terms</Link>
              <span>·</span>
              <Link href="/privacy">Privacy</Link>
            </div>
          </div>
          <div className="footer-bar-right">
            <Link href="/staff-login" className="footer-staff-link">Staff</Link>
            <div className="footer-socials">
              <a href="https://www.instagram.com/majesticcarwash8017/" target="_blank" rel="noopener noreferrer">📷</a>
              <a href="https://www.facebook.com/majesticcarwash/" target="_blank" rel="noopener noreferrer">📘</a>
              <a href="tel:3239337393">📞</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}