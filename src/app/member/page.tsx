"use client";

import Link from "next/link";
import { useState } from "react";

/* Mock member data — this would come from Firebase later */
const MEMBER = {
  firstName: "John",
  lastName: "Smith",
  initials: "JS",
  memberId: "MCW-2847",
  plan: "Premium",
  planSlug: "premium",
  price: 49.99,
  status: "Active",
  nextBilling: "Apr 15, 2026",
  memberSince: "Mar 2026",
  paymentMethod: "Visa ••4589",
  vehicle: {
    type: "sedan",
    icon: "🚗",
    make: "Tesla",
    model: "Model 3",
    year: "2024",
    color: "White",
    plate: "7ABC123",
  },
  visits: [
    { date: "Mar 14, 2026", type: "Full-Service Wash", ago: "Today" },
    { date: "Mar 11, 2026", type: "Full-Service Wash", ago: "3 days ago" },
    { date: "Mar 7, 2026", type: "Full-Service Wash", ago: "1 week ago" },
    { date: "Mar 2, 2026", type: "Full-Service Wash", ago: "2 weeks ago" },
  ],
  totalWashesThisMonth: 4,
  retailValuePerWash: 49.99,
};

export default function MemberPage() {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const savings = (MEMBER.totalWashesThisMonth * MEMBER.retailValuePerWash - MEMBER.price).toFixed(2);

  return (
    <div className="member-page">
      <div className="member-bg" />

      {/* Top bar */}
      <div className="member-topbar">
        <Link href="/" className="member-logo">
          <div className="member-logo-icon">M</div>
          <span>Majestic Car Wash</span>
        </Link>
        <div className="member-topbar-right">
          <Link href="/login" className="member-topbar-link">Sign Out</Link>
          <div className="member-avatar">{MEMBER.initials}</div>
        </div>
      </div>

      <div className="member-wrap">
        {/* Greeting */}
        <div className="member-greeting">
          <h1>Hey, {MEMBER.firstName} 👋</h1>
          <p>Your car&apos;s looking fresh. Here&apos;s your membership at a glance.</p>
        </div>

        <div className="member-grid">
          {/* ===== LEFT: QR Card ===== */}
          <div className="qr-card">
            <div className="qr-status">
              <span className="qr-status-dot" />
              Active Member
            </div>

            <div className="qr-code">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {/* Position markers */}
                <rect x="5" y="5" width="25" height="25" rx="3" fill="#070E24"/>
                <rect x="70" y="5" width="25" height="25" rx="3" fill="#070E24"/>
                <rect x="5" y="70" width="25" height="25" rx="3" fill="#070E24"/>
                <rect x="10" y="10" width="15" height="15" rx="2" fill="#070E24"/>
                <rect x="75" y="10" width="15" height="15" rx="2" fill="#070E24"/>
                <rect x="10" y="75" width="15" height="15" rx="2" fill="#070E24"/>
                <rect x="13" y="13" width="9" height="9" fill="#D4202C"/>
                <rect x="78" y="13" width="9" height="9" fill="#D4202C"/>
                <rect x="13" y="78" width="9" height="9" fill="#D4202C"/>
                {/* Data pattern */}
                <rect x="35" y="5" width="5" height="5" fill="#070E24"/>
                <rect x="45" y="5" width="5" height="5" fill="#070E24"/>
                <rect x="55" y="10" width="5" height="5" fill="#070E24"/>
                <rect x="35" y="15" width="5" height="5" fill="#070E24"/>
                <rect x="50" y="15" width="5" height="5" fill="#070E24"/>
                <rect x="60" y="15" width="5" height="5" fill="#070E24"/>
                <rect x="35" y="25" width="5" height="5" fill="#070E24"/>
                <rect x="45" y="25" width="5" height="5" fill="#070E24"/>
                <rect x="40" y="35" width="5" height="5" fill="#070E24"/>
                <rect x="50" y="35" width="5" height="5" fill="#070E24"/>
                <rect x="60" y="35" width="5" height="5" fill="#070E24"/>
                <rect x="5" y="40" width="5" height="5" fill="#070E24"/>
                <rect x="15" y="40" width="5" height="5" fill="#070E24"/>
                <rect x="25" y="45" width="5" height="5" fill="#070E24"/>
                <rect x="35" y="45" width="5" height="5" fill="#070E24"/>
                <rect x="50" y="45" width="5" height="5" fill="#070E24"/>
                <rect x="70" y="40" width="5" height="5" fill="#070E24"/>
                <rect x="80" y="45" width="5" height="5" fill="#070E24"/>
                <rect x="90" y="40" width="5" height="5" fill="#070E24"/>
                <rect x="5" y="55" width="5" height="5" fill="#070E24"/>
                <rect x="20" y="55" width="5" height="5" fill="#070E24"/>
                <rect x="35" y="55" width="5" height="5" fill="#070E24"/>
                <rect x="45" y="55" width="5" height="5" fill="#070E24"/>
                <rect x="60" y="60" width="5" height="5" fill="#070E24"/>
                <rect x="70" y="55" width="5" height="5" fill="#070E24"/>
                <rect x="85" y="55" width="5" height="5" fill="#070E24"/>
                <rect x="70" y="70" width="5" height="5" fill="#070E24"/>
                <rect x="80" y="70" width="5" height="5" fill="#070E24"/>
                <rect x="90" y="75" width="5" height="5" fill="#070E24"/>
                <rect x="70" y="80" width="5" height="5" fill="#070E24"/>
                <rect x="85" y="85" width="5" height="5" fill="#070E24"/>
                <rect x="90" y="90" width="5" height="5" fill="#070E24"/>
                <rect x="75" y="90" width="5" height="5" fill="#070E24"/>
              </svg>
            </div>

            <div className="qr-member-name">{MEMBER.firstName} {MEMBER.lastName}</div>
            <div className="qr-member-id">Member #{MEMBER.memberId}</div>
            <div className="qr-plan-badge">⭐ {MEMBER.plan} Member</div>
            <div className="qr-instruction">
              Show this code when you pull up.
              <br />
              Staff will scan to verify your membership.
            </div>
          </div>

          {/* ===== RIGHT: Details ===== */}
          <div className="member-right">

            {/* Membership Status */}
            <div className="member-card">
              <div className="member-card-header">
                <div className="member-card-title">Membership Status</div>
              </div>
              <div className="status-grid">
                <div className="status-item">
                  <div className="status-label">Plan</div>
                  <div className="status-value gold">{MEMBER.plan}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Monthly</div>
                  <div className="status-value">${MEMBER.price.toFixed(2)}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Next Billing</div>
                  <div className="status-value">{MEMBER.nextBilling}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Member Since</div>
                  <div className="status-value">{MEMBER.memberSince}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Status</div>
                  <div className="status-value green">{MEMBER.status}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Payment</div>
                  <div className="status-value">{MEMBER.paymentMethod}</div>
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="member-card">
              <div className="member-card-header">
                <div className="member-card-title">Vehicle on File</div>
                <a className="member-card-action" href="#">Update Vehicle →</a>
              </div>
              <div className="vehicle-row">
                <div className="vehicle-icon-box">{MEMBER.vehicle.icon}</div>
                <div className="vehicle-info">
                  <div className="vehicle-name">
                    {MEMBER.vehicle.year} {MEMBER.vehicle.make} {MEMBER.vehicle.model}
                  </div>
                  <div className="vehicle-meta">
                    {MEMBER.vehicle.color} · {MEMBER.vehicle.type.charAt(0).toUpperCase() + MEMBER.vehicle.type.slice(1)}
                  </div>
                </div>
                <div className="vehicle-plate">{MEMBER.vehicle.plate}</div>
              </div>
            </div>

            {/* Visit History */}
            <div className="member-card">
              <div className="member-card-header">
                <div className="member-card-title">Recent Visits</div>
                <a className="member-card-action" href="#">View All →</a>
              </div>
              <div className="visit-list">
                {MEMBER.visits.map((v, i) => (
                  <div className="visit-item" key={i}>
                    <div className="visit-left">
                      <div className="visit-dot" />
                      <div>
                        <div className="visit-date">{v.date}</div>
                        <div className="visit-type">{v.type}</div>
                      </div>
                    </div>
                    <div className="visit-badge">{v.ago}</div>
                  </div>
                ))}
              </div>
              <div className="visit-count-bar">
                <div className="visit-count-text">
                  <strong>{MEMBER.totalWashesThisMonth} washes</strong> this month
                </div>
                <div className="visit-savings">Saving ${savings} vs retail</div>
              </div>
            </div>

            {/* Manage Subscription */}
            <div className="member-card">
              <div className="member-card-header">
                <div className="member-card-title">Manage Subscription</div>
              </div>

              {!showCancelConfirm ? (
                <div className="manage-actions">
                  <button className="manage-btn manage-upgrade">⬆ Upgrade to Ultimate</button>
                  <button className="manage-btn manage-outline">Update Payment</button>
                  <button className="manage-btn manage-outline">Pause Membership</button>
                  <button className="manage-btn manage-danger" onClick={() => setShowCancelConfirm(true)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="cancel-confirm">
                  <div className="cancel-confirm-text">
                    <strong>Are you sure?</strong> You&apos;ll lose unlimited washes and your
                    ${savings} monthly savings. Your membership stays active until {MEMBER.nextBilling}.
                  </div>
                  <div className="cancel-confirm-btns">
                    <button
                      className="manage-btn manage-outline"
                      onClick={() => setShowCancelConfirm(false)}
                    >
                      Keep My Membership
                    </button>
                    <button className="manage-btn manage-danger">
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}