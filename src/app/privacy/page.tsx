import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <div className="legal-topbar">
        <Link href="/" className="legal-logo">
          <div className="legal-logo-icon">M</div>
          <span>Majestic Car Wash</span>
        </Link>
        <Link href="/" className="legal-back">← Back to site</Link>
      </div>

      <div className="legal-wrap">
        <div className="legal-header">
          <h1>Privacy Policy</h1>
          <p>Last updated: March 15, 2026</p>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>
              When you sign up for a Majestic Car Wash membership, we collect the following
              information: your name, email address, phone number, vehicle information (make, model,
              color, license plate number, and vehicle type), and payment information. Payment details
              are processed and stored securely by Stripe — we never store your full credit card number
              on our servers.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>
              We use your information to: manage your membership account and process recurring payments,
              verify your membership at check-in using your name, license plate, or QR code,
              send you membership confirmations, billing receipts, and service notifications via
              email or SMS, improve our services and communicate important updates about your account.
              We do not sell, rent, or share your personal information with third parties for marketing
              purposes.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. SMS Communications</h2>
            <p>
              If you opt in to SMS login or notifications, you may receive text messages including:
              one-time verification codes for account login, membership confirmation and billing
              receipts, and service reminders or account alerts. Message and data rates may apply.
              You can opt out of non-essential SMS at any time by updating your preferences in your
              member dashboard or by replying STOP to any message.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Data Storage & Security</h2>
            <p>
              Your data is stored using industry-standard security practices. We use Firebase for
              account data and Stripe for payment processing — both maintain SOC 2 compliance and
              encrypt data in transit and at rest. Access to member data is restricted to authorized
              Majestic Car Wash staff for the purpose of providing wash services and managing your
              account.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Visit History</h2>
            <p>
              We record the date and type of service each time you check in for a wash. This data
              is used to display your visit history in your member dashboard and to track usage for
              operational purposes. Visit history is associated with your account and is not shared
              externally.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Cookies & Analytics</h2>
            <p>
              Our website may use cookies and similar technologies to improve your browsing experience
              and understand how visitors interact with our site. We may use third-party analytics
              services (such as Google Analytics) that collect anonymous usage data. You can control
              cookie settings through your browser preferences.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Third-Party Services</h2>
            <p>
              We use the following third-party services to operate our membership platform:
              Stripe for payment processing, Firebase for account data storage, Twilio for SMS
              verification and notifications, and Vercel for website hosting. Each of these services
              has their own privacy policies governing how they handle data.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Your Rights</h2>
            <p>
              You have the right to: access the personal information we hold about you, request
              correction of inaccurate information, request deletion of your account and associated
              data, opt out of non-essential communications, and export your data in a portable format.
              To exercise any of these rights, contact us using the information below.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. California Privacy Rights (CCPA)</h2>
            <p>
              If you are a California resident, you have additional rights under the California
              Consumer Privacy Act (CCPA), including the right to know what personal information we
              collect, the right to request deletion of your data, and the right to opt out of the
              sale of personal information. We do not sell personal information.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Contact</h2>
            <p>
              For privacy-related questions or requests, contact us at:<br />
              Majestic Car Wash<br />
              8017 W 3rd Street, Los Angeles, CA 90048<br />
              (323) 933-7393
            </p>
          </div>
        </div>

        <div className="legal-footer-links">
          <Link href="/terms">Terms of Service</Link>
          <span>·</span>
          <Link href="/">Home</Link>
        </div>
      </div>
    </div>
  );
}