import Link from "next/link";

export default function TermsPage() {
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
          <h1>Terms of Service</h1>
          <p>Last updated: March 15, 2026</p>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Membership Agreement</h2>
            <p>
              By purchasing a Majestic Car Wash unlimited membership (&quot;Membership&quot;), you agree to
              these Terms of Service. Your Membership provides unlimited car wash services at our
              Beverly Grove location (8017 W 3rd Street, Los Angeles, CA 90048) based on your
              selected plan tier (Essential, Premium, or Ultimate).
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Billing & Payment</h2>
            <p>
              Memberships are billed monthly on a recurring basis. Your first month is billed at the
              promotional rate of $14.99 regardless of plan tier. After the first month, your selected
              plan rate applies: Essential ($34.99/mo), Premium ($49.99/mo), or Ultimate ($64.99/mo).
              SUV, truck, and minivan vehicles incur an additional $5.00/mo surcharge. All payments are
              processed securely through Stripe. You authorize us to charge your payment method on file
              each billing cycle until you cancel.
            </p>
          </div>

          <div className="legal-section">
            <h2>3. Cancellation & Refunds</h2>
            <p>
              You may cancel your Membership at any time through your member dashboard or by contacting
              us at (323) 933-7393. Upon cancellation, your Membership remains active through the end of
              your current billing period. No partial refunds are issued for unused portions of a billing
              cycle. There are no cancellation fees or long-term contracts.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Membership Usage</h2>
            <p>
              Each Membership is valid for one (1) vehicle only, as registered at the time of enrollment.
              Memberships are non-transferable between vehicles or individuals. If you change vehicles,
              you must update your vehicle information through your member dashboard. Misrepresentation of
              vehicle type (e.g., registering an SUV as a sedan to avoid the surcharge) may result in
              account adjustment or termination. Members must present their QR code, provide their name,
              or provide their license plate number at check-in for verification.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Service Limitations</h2>
            <p>
              Unlimited wash Memberships are intended for normal personal use. We reserve the right to
              limit service to vehicles that are excessively soiled beyond normal conditions (e.g.,
              construction debris, hazardous materials). Membership services are available during normal
              business hours: Monday through Saturday 8:00 AM – 6:00 PM, Sunday 8:00 AM – 5:00 PM.
              Hours may vary on holidays.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Vehicle Care & Liability</h2>
            <p>
              Majestic Car Wash takes every precaution to protect your vehicle during service. Our
              100% hand wash process is designed to be scratch-free. However, we are not responsible
              for damage caused by pre-existing conditions including but not limited to: loose trim,
              aftermarket modifications, chipped paint, cracked windshields, or unsecured personal
              belongings. Any damage claims must be reported before leaving the premises.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Pause & Reactivation</h2>
            <p>
              Members may pause their Membership for up to 60 days per calendar year through their
              member dashboard. During a pause, no charges will be incurred and wash services will be
              unavailable. Your Membership will automatically reactivate at the end of the pause period.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Plan Changes</h2>
            <p>
              You may upgrade or downgrade your plan at any time. Upgrades take effect immediately with
              a prorated charge for the remainder of your billing cycle. Downgrades take effect at the
              start of your next billing cycle.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Termination</h2>
            <p>
              We reserve the right to terminate any Membership for abuse, fraud, or violation of these
              Terms. This includes but is not limited to: sharing membership credentials, using the
              membership for commercial fleet vehicles, or abusive behavior toward staff.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Contact</h2>
            <p>
              For questions about these Terms, contact us at:<br />
              Majestic Car Wash<br />
              8017 W 3rd Street, Los Angeles, CA 90048<br />
              (323) 933-7393
            </p>
          </div>
        </div>

        <div className="legal-footer-links">
          <Link href="/privacy">Privacy Policy</Link>
          <span>·</span>
          <Link href="/">Home</Link>
        </div>
      </div>
    </div>
  );
}