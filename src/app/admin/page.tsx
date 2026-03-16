"use client";

import { useState } from "react";
import Link from "next/link";

/* ===== MOCK DATA ===== */
const RECENT_CHECKINS = [
  { time: "2:34 PM", initials: "JS", name: "John Smith", vehicle: "2024 Tesla Model 3 · White · 7ABC123", plan: "premium" },
  { time: "2:21 PM", initials: "MR", name: "Maria Rodriguez", vehicle: "2023 BMW X5 · Black · 8DEF456", plan: "ultimate" },
  { time: "2:08 PM", initials: "DK", name: "David Kim", vehicle: "2025 Mercedes GLC · Silver · 3GHI789", plan: "premium" },
  { time: "1:52 PM", initials: "SJ", name: "Sarah Johnson", vehicle: "2024 Toyota Camry · Gray · 5JKL012", plan: "essential" },
  { time: "1:38 PM", initials: "AC", name: "Alex Chen", vehicle: "2023 Porsche Cayenne · White · 9MNO345", plan: "ultimate" },
];

const ALL_MEMBERS = [
  { initials: "JS", name: "John Smith", email: "john@example.com", vehicle: "2024 Tesla Model 3", plate: "7ABC123", plan: "premium", visits: 4, status: "active" },
  { initials: "MR", name: "Maria Rodriguez", email: "maria@email.com", vehicle: "2023 BMW X5", plate: "8DEF456", plan: "ultimate", visits: 7, status: "active" },
  { initials: "DK", name: "David Kim", email: "david.k@gmail.com", vehicle: "2025 Mercedes GLC", plate: "3GHI789", plan: "premium", visits: 3, status: "active" },
  { initials: "SJ", name: "Sarah Johnson", email: "sarahj@yahoo.com", vehicle: "2024 Toyota Camry", plate: "5JKL012", plan: "essential", visits: 2, status: "active" },
  { initials: "AC", name: "Alex Chen", email: "alex.chen@icloud.com", vehicle: "2023 Porsche Cayenne", plate: "9MNO345", plan: "ultimate", visits: 6, status: "active" },
  { initials: "LP", name: "Lisa Park", email: "lisa.p@outlook.com", vehicle: "2022 Honda CR-V", plate: "2PQR678", plan: "premium", visits: 5, status: "paused" },
];

const PLAN_CLASS: Record<string, string> = {
  essential: "adm-plan-essential",
  premium: "adm-plan-premium",
  ultimate: "adm-plan-ultimate",
};

const PLAN_LABEL: Record<string, string> = {
  essential: "Essential",
  premium: "Premium",
  ultimate: "Ultimate",
};

export default function AdminPage() {
  const [view, setView] = useState<"dashboard" | "lookup" | "members">("dashboard");
  const [lookupQuery, setLookupQuery] = useState("");
  const [memberSearch, setMemberSearch] = useState("");

  const showResult = lookupQuery.length >= 3;

  const filteredMembers = memberSearch
    ? ALL_MEMBERS.filter(
        (m) =>
          m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
          m.plate.toLowerCase().includes(memberSearch.toLowerCase()) ||
          m.email.toLowerCase().includes(memberSearch.toLowerCase())
      )
    : ALL_MEMBERS;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="adm-page">
      {/* Top Nav */}
      <nav className="adm-nav">
        <div className="adm-nav-left">
          <Link href="/" className="adm-logo">
            <div className="adm-logo-icon">M</div>
            <span className="adm-logo-text">Majestic</span>
          </Link>
          <div className="adm-badge">Staff</div>
        </div>
        <div className="adm-nav-right">
          <span className="adm-nav-date">{today}</span>
          <div className="adm-nav-user">
            <div className="adm-nav-avatar">JV</div>
            <span className="adm-nav-name">Javier</span>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="adm-tabs">
        <button className={`adm-tab${view === "dashboard" ? " active" : ""}`} onClick={() => setView("dashboard")}>
          📊 Dashboard
        </button>
        <button className={`adm-tab${view === "lookup" ? " active" : ""}`} onClick={() => setView("lookup")}>
          🔍 Check-In
        </button>
        <button className={`adm-tab${view === "members" ? " active" : ""}`} onClick={() => setView("members")}>
          👥 Members
        </button>
      </div>

      <div className="adm-content">

        {/* ==================== DASHBOARD ==================== */}
        {view === "dashboard" && (
          <div className="adm-view">
            <div className="adm-top">
              <h1>Good morning, Javier</h1>
              <p>Here&apos;s what&apos;s happening at Majestic today.</p>
            </div>

            {/* Stats */}
            <div className="adm-stat-row">
              <div className="adm-stat">
                <div className="adm-stat-top">
                  <div className="adm-stat-icon adm-si-red">🚿</div>
                  <span className="adm-stat-change adm-sc-up">↑ 12%</span>
                </div>
                <div className="adm-stat-number">34</div>
                <div className="adm-stat-label">Washes Today</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-top">
                  <div className="adm-stat-icon adm-si-green">👥</div>
                  <span className="adm-stat-change adm-sc-up">↑ 8</span>
                </div>
                <div className="adm-stat-number">412</div>
                <div className="adm-stat-label">Active Members</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-top">
                  <div className="adm-stat-icon adm-si-gold">💰</div>
                  <span className="adm-stat-change adm-sc-up">↑ $2.1K</span>
                </div>
                <div className="adm-stat-number">$18.8K</div>
                <div className="adm-stat-label">Monthly MRR</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-top">
                  <div className="adm-stat-icon adm-si-blue">⭐</div>
                  <span className="adm-stat-change adm-sc-neutral">—</span>
                </div>
                <div className="adm-stat-number">22</div>
                <div className="adm-stat-label">Member Washes Today</div>
              </div>
            </div>

            <div className="adm-dash-grid">
              {/* Recent Check-Ins */}
              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-title">Recent Check-Ins</div>
                  <a className="adm-card-action" onClick={() => setView("lookup")}>Open Check-In →</a>
                </div>
                <div className="adm-checkin-list">
                  {RECENT_CHECKINS.map((c, i) => (
                    <div className="adm-checkin-row" key={i}>
                      <div className="adm-checkin-time">{c.time}</div>
                      <div className="adm-checkin-avatar">{c.initials}</div>
                      <div className="adm-checkin-info">
                        <div className="adm-checkin-name">{c.name}</div>
                        <div className="adm-checkin-detail">{c.vehicle}</div>
                      </div>
                      <div className={`adm-checkin-plan ${PLAN_CLASS[c.plan]}`}>
                        {PLAN_LABEL[c.plan]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-title">Quick Actions</div>
                </div>
                <div className="adm-quick-actions">
                  <button className="adm-quick-btn" onClick={() => setView("lookup")}>
                    <div className="adm-qb-icon adm-si-red">📷</div>
                    <div className="adm-qb-text">
                      <div className="adm-qb-title">Scan QR Code</div>
                      <div className="adm-qb-sub">Verify member at check-in</div>
                    </div>
                    <div className="adm-qb-arrow">→</div>
                  </button>
                  <button className="adm-quick-btn" onClick={() => setView("lookup")}>
                    <div className="adm-qb-icon adm-si-blue">🔍</div>
                    <div className="adm-qb-text">
                      <div className="adm-qb-title">Look Up Member</div>
                      <div className="adm-qb-sub">Search by plate, name, or phone</div>
                    </div>
                    <div className="adm-qb-arrow">→</div>
                  </button>
                  <button className="adm-quick-btn">
                    <div className="adm-qb-icon adm-si-green">➕</div>
                    <div className="adm-qb-text">
                      <div className="adm-qb-title">Add Walk-In Wash</div>
                      <div className="adm-qb-sub">Log a non-member wash</div>
                    </div>
                    <div className="adm-qb-arrow">→</div>
                  </button>
                  <button className="adm-quick-btn" onClick={() => setView("members")}>
                    <div className="adm-qb-icon adm-si-gold">👥</div>
                    <div className="adm-qb-text">
                      <div className="adm-qb-title">View All Members</div>
                      <div className="adm-qb-sub">Browse and manage accounts</div>
                    </div>
                    <div className="adm-qb-arrow">→</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CHECK-IN LOOKUP ==================== */}
        {view === "lookup" && (
          <div className="adm-view">
            <div className="adm-top" style={{ textAlign: "center" }}>
              <h1>Member Check-In</h1>
              <p>Scan a QR code or search to verify membership.</p>
            </div>

            <button className="adm-scan-btn">📷 &nbsp;Scan QR Code</button>

            <div className="adm-lookup-or">or search manually</div>

            <div className="adm-lookup-search-wrap">
              <div className="adm-lookup-search-icon">🔍</div>
              <input
                type="text"
                className="adm-lookup-search"
                placeholder="Plate, name, or phone number..."
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
              />
            </div>
            <div className="adm-lookup-hint">Try typing &quot;7ABC&quot; or &quot;John&quot;</div>

            {showResult && (
              <div className="adm-lookup-result">
                <div className="adm-result-card">
                  <div className="adm-result-status">
                    <div className="adm-result-status-left">
                      <div className="adm-result-status-dot" />
                      Active Membership
                    </div>
                    <div className={`adm-result-plan-badge adm-plan-premium`}>⭐ Premium</div>
                  </div>
                  <div className="adm-result-body">
                    <div className="adm-result-row">
                      <div className="adm-result-avatar">JS</div>
                      <div>
                        <div className="adm-result-name">John Smith</div>
                        <div className="adm-result-id">Member #MCW-2847 · Since Mar 2026</div>
                      </div>
                    </div>

                    <div className="adm-result-details">
                      <div className="adm-rd-item">
                        <div className="adm-rd-label">Plan</div>
                        <div className="adm-rd-value">Premium — $49.99/mo</div>
                      </div>
                      <div className="adm-rd-item">
                        <div className="adm-rd-label">Washes This Month</div>
                        <div className="adm-rd-value">4 washes</div>
                      </div>
                      <div className="adm-rd-item">
                        <div className="adm-rd-label">Last Visit</div>
                        <div className="adm-rd-value">Today, 2:34 PM</div>
                      </div>
                      <div className="adm-rd-item">
                        <div className="adm-rd-label">Phone</div>
                        <div className="adm-rd-value">(310) 555-1234</div>
                      </div>
                    </div>

                    <div className="adm-result-vehicle">
                      <div className="adm-rv-icon">🚗</div>
                      <div className="adm-rv-info">
                        <div className="adm-rv-name">2024 Tesla Model 3</div>
                        <div className="adm-rv-meta">White · Sedan</div>
                      </div>
                      <div className="adm-rv-plate">7ABC123</div>
                    </div>

                    <div className="adm-result-actions">
                      <button className="adm-ra-btn adm-ra-green">✓ Check In — Full-Service Wash</button>
                      <button className="adm-ra-btn adm-ra-outline">View Full Profile</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== ALL MEMBERS ==================== */}
        {view === "members" && (
          <div className="adm-view">
            <div className="adm-members-top">
              <h1>All Members ({ALL_MEMBERS.length})</h1>
              <input
                type="text"
                className="adm-members-search"
                placeholder="Search members..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
              />
            </div>

            <div className="adm-table">
              <div className="adm-table-header">
                <div>Member</div>
                <div>Vehicle</div>
                <div>Plan</div>
                <div>Visits (Mar)</div>
                <div>Status</div>
              </div>
              {filteredMembers.map((m, i) => (
                <div className="adm-table-row" key={i}>
                  <div className="adm-table-member">
                    <div className="adm-table-avatar">{m.initials}</div>
                    <div>
                      <div className="adm-table-name">{m.name}</div>
                      <div className="adm-table-email">{m.email}</div>
                    </div>
                  </div>
                  <div>
                    <div className="adm-table-vehicle">{m.vehicle}</div>
                    <div className="adm-table-plate">{m.plate}</div>
                  </div>
                  <div>
                    <span className={`adm-table-plan ${PLAN_CLASS[m.plan]}`}>{PLAN_LABEL[m.plan]}</span>
                  </div>
                  <div className="adm-table-visits">{m.visits}</div>
                  <div className="adm-table-status">
                    <span className={`adm-table-status-dot ${m.status === "active" ? "dot-active" : "dot-paused"}`} />
                    {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}