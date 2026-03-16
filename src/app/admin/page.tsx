"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  getAllMembers,
  searchMembers,
  getDashboardStats,
  getTodaysVisits,
  logVisit,
  getMember,
  getMonthlyVisitCount,
  getAllVisitCounts,
  type Member,
  type Visit,
} from "@/lib/firestore";

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

function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function getServiceType(plan: string) {
  if (plan === "essential") return "Exterior Hand Wash";
  if (plan === "ultimate") return "Full-Service + Detail";
  return "Full-Service Wash";
}

function getMemberDuration(memberSince: string): string {
  if (!memberSince) return "—";
  const parts = memberSince.split(" ");
  if (parts.length < 2) return memberSince;
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthIndex = monthNames.indexOf(parts[0]);
  const year = parseInt(parts[1]);
  if (monthIndex === -1 || isNaN(year)) return memberSince;
  const joinDate = new Date(year, monthIndex, 1);
  const now = new Date();
  const diffMs = now.getTime() - joinDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Today";
  if (diffDays < 30) return `${diffDays}d`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} mo${diffMonths !== 1 ? "s" : ""}`;
  const diffYears = Math.floor(diffMonths / 12);
  const remainingMonths = diffMonths % 12;
  return remainingMonths > 0 ? `${diffYears}y ${remainingMonths}mo` : `${diffYears}y`;
}

export default function AdminPage() {
  const [view, setView] = useState<"dashboard" | "lookup" | "members">("dashboard");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ activeMembers: 0, todaysWashes: 0, memberWashesToday: 0, mrr: 0 });
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);

  const [members, setMembers] = useState<Member[]>([]);
  const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});
  const [memberSearch, setMemberSearch] = useState("");

  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResults, setLookupResults] = useState<Member[]>([]);
  const [lookupMember, setLookupMember] = useState<Member | null>(null);
  const [lookupVisitCount, setLookupVisitCount] = useState(0);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  // QR Scanner state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanError, setScanError] = useState("");
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5ScannerRef = useRef<any>(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "short", day: "numeric", year: "numeric",
  });

  const loadDashboard = useCallback(async () => {
    try {
      const [s, visits] = await Promise.all([getDashboardStats(), getTodaysVisits()]);
      setStats(s);
      setRecentVisits(visits);
    } catch (err) { console.error("Failed to load dashboard:", err); }
  }, []);

  const loadMembers = useCallback(async () => {
    try {
      const [all, counts] = await Promise.all([getAllMembers(), getAllVisitCounts()]);
      setMembers(all);
      setVisitCounts(counts);
    } catch (err) { console.error("Failed to load members:", err); }
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([loadDashboard(), loadMembers()]);
      setLoading(false);
    }
    init();
  }, [loadDashboard, loadMembers]);

  // Lookup search
  useEffect(() => {
    if (lookupQuery.length < 2) { setLookupResults([]); setLookupMember(null); return; }
    const timer = setTimeout(async () => {
      const results = await searchMembers(lookupQuery);
      setLookupResults(results);
      if (results.length === 1) selectLookupMember(results[0]);
      else setLookupMember(null);
    }, 300);
    return () => clearTimeout(timer);
  }, [lookupQuery]);

  // Cleanup scanner on unmount or view change
  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  useEffect(() => {
    if (view !== "lookup") stopScanner();
  }, [view]);

  async function selectLookupMember(member: Member) {
    setLookupMember(member);
    setCheckedIn(false);
    if (member.id) {
      const count = await getMonthlyVisitCount(member.id);
      setLookupVisitCount(count);
    }
  }

  async function handleCheckIn() {
    if (!lookupMember?.id || checkingIn) return;
    setCheckingIn(true);
    try {
      await logVisit({
        memberId: lookupMember.id,
        memberName: `${lookupMember.firstName} ${lookupMember.lastName}`,
        memberInitials: getInitials(lookupMember.firstName, lookupMember.lastName),
        serviceType: getServiceType(lookupMember.plan),
        plan: lookupMember.plan,
        vehicleInfo: `${lookupMember.make} ${lookupMember.model} · ${lookupMember.color} · ${lookupMember.plate}`,
      });
      setCheckedIn(true);
      setLookupVisitCount((prev) => prev + 1);
      loadDashboard();
    } catch (err) {
      console.error("Check-in failed:", err);
      alert("Check-in failed. Please try again.");
    } finally { setCheckingIn(false); }
  }

  /* ===== QR SCANNER ===== */
  async function startScanner() {
    setScanError("");
    setScannerOpen(true);
    setLookupMember(null);
    setLookupResults([]);
    setLookupQuery("");
    setCheckedIn(false);

    // Wait for DOM element to render
    await new Promise((r) => setTimeout(r, 100));

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      if (html5ScannerRef.current) {
        try { await html5ScannerRef.current.stop(); } catch { /* already stopped */ }
      }

      const scanner = new Html5Qrcode("qr-reader");
      html5ScannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        async (decodedText: string) => {
          // Stop scanner immediately on successful scan
          try { await scanner.stop(); } catch { /* ignore */ }
          setScannerOpen(false);
          html5ScannerRef.current = null;

          // Parse MCW:{memberId} format
          const memberId = decodedText.startsWith("MCW:") ? decodedText.slice(4) : decodedText;

          try {
            const member = await getMember(memberId);
            if (member) {
              await selectLookupMember(member);
            } else {
              setScanError("No member found for this QR code.");
            }
          } catch (err) {
            console.error("QR lookup failed:", err);
            setScanError("Failed to look up member. Please try again.");
          }
        },
        () => { /* ignore scan failures (no QR in frame) */ }
      );
    } catch (err: any) {
      console.error("Scanner error:", err);
      setScannerOpen(false);
      if (err?.message?.includes("NotAllowedError") || err?.name === "NotAllowedError") {
        setScanError("Camera access denied. Please allow camera permissions and try again.");
      } else if (err?.message?.includes("NotFoundError") || err?.name === "NotFoundError") {
        setScanError("No camera found on this device.");
      } else {
        setScanError("Could not start camera. Try the manual search instead.");
      }
    }
  }

  async function stopScanner() {
    if (html5ScannerRef.current) {
      try { await html5ScannerRef.current.stop(); } catch { /* ignore */ }
      html5ScannerRef.current = null;
    }
    setScannerOpen(false);
  }

  const filteredMembers = memberSearch
    ? members.filter((m) =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.plate.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(memberSearch.toLowerCase())
      )
    : members;

  function formatVisitTime(visit: Visit) {
    if (!visit.date?.toDate) return "";
    return visit.date.toDate().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }

  return (
    <div className="adm-page">
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

      <div className="adm-tabs">
        <button className={`adm-tab${view === "dashboard" ? " active" : ""}`} onClick={() => { setView("dashboard"); loadDashboard(); }}>📊 Dashboard</button>
        <button className={`adm-tab${view === "lookup" ? " active" : ""}`} onClick={() => setView("lookup")}>🔍 Check-In</button>
        <button className={`adm-tab${view === "members" ? " active" : ""}`} onClick={() => { setView("members"); loadMembers(); }}>👥 Members</button>
      </div>

      <div className="adm-content">

        {/* ==================== DASHBOARD ==================== */}
        {view === "dashboard" && (
          <div className="adm-view">
            <div className="adm-top">
              <h1>Good morning, Javier</h1>
              <p>Here&apos;s what&apos;s happening at Majestic today.</p>
            </div>

            <div className="adm-stat-row">
              <div className="adm-stat">
                <div className="adm-stat-top"><div className="adm-stat-icon adm-si-red">🚿</div><span className="adm-stat-change adm-sc-neutral">{loading ? "..." : ""}</span></div>
                <div className="adm-stat-number">{loading ? "—" : stats.todaysWashes}</div>
                <div className="adm-stat-label">Washes Today</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-top"><div className="adm-stat-icon adm-si-green">👥</div><span className="adm-stat-change adm-sc-neutral">{loading ? "..." : ""}</span></div>
                <div className="adm-stat-number">{loading ? "—" : stats.activeMembers}</div>
                <div className="adm-stat-label">Active Members</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-top"><div className="adm-stat-icon adm-si-gold">💰</div><span className="adm-stat-change adm-sc-neutral">{loading ? "..." : ""}</span></div>
                <div className="adm-stat-number">{loading ? "—" : `$${(stats.mrr / 1000).toFixed(1)}K`}</div>
                <div className="adm-stat-label">Monthly MRR</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-top"><div className="adm-stat-icon adm-si-blue">⭐</div><span className="adm-stat-change adm-sc-neutral">{loading ? "..." : ""}</span></div>
                <div className="adm-stat-number">{loading ? "—" : stats.memberWashesToday}</div>
                <div className="adm-stat-label">Member Washes Today</div>
              </div>
            </div>

            <div className="adm-dash-grid">
              <div className="adm-card">
                <div className="adm-card-header">
                  <div className="adm-card-title">Recent Check-Ins</div>
                  <a className="adm-card-action" onClick={() => setView("lookup")}>Open Check-In →</a>
                </div>
                <div className="adm-checkin-list">
                  {recentVisits.length === 0 && !loading && (
                    <div style={{ padding: "32px 24px", textAlign: "center", color: "#9CA3AF", fontSize: "14px" }}>
                      No check-ins yet today. Use the Check-In tab to log visits.
                    </div>
                  )}
                  {recentVisits.slice(0, 8).map((v, i) => (
                    <div className="adm-checkin-row" key={v.id || i}>
                      <div className="adm-checkin-time">{formatVisitTime(v)}</div>
                      <div className="adm-checkin-avatar">{v.memberInitials}</div>
                      <div className="adm-checkin-info">
                        <div className="adm-checkin-name">{v.memberName}</div>
                        <div className="adm-checkin-detail">{v.vehicleInfo}</div>
                      </div>
                      <div className={`adm-checkin-plan ${PLAN_CLASS[v.plan] || ""}`}>{PLAN_LABEL[v.plan] || v.plan}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="adm-card">
                <div className="adm-card-header"><div className="adm-card-title">Quick Actions</div></div>
                <div className="adm-quick-actions">
                  <button className="adm-quick-btn" onClick={() => { setView("lookup"); setTimeout(startScanner, 200); }}>
                    <div className="adm-qb-icon adm-si-red">📷</div>
                    <div className="adm-qb-text"><div className="adm-qb-title">Scan QR Code</div><div className="adm-qb-sub">Verify member at check-in</div></div>
                    <div className="adm-qb-arrow">→</div>
                  </button>
                  <button className="adm-quick-btn" onClick={() => setView("lookup")}>
                    <div className="adm-qb-icon adm-si-blue">🔍</div>
                    <div className="adm-qb-text"><div className="adm-qb-title">Look Up Member</div><div className="adm-qb-sub">Search by plate, name, or phone</div></div>
                    <div className="adm-qb-arrow">→</div>
                  </button>
                  <button className="adm-quick-btn">
                    <div className="adm-qb-icon adm-si-green">➕</div>
                    <div className="adm-qb-text"><div className="adm-qb-title">Add Walk-In Wash</div><div className="adm-qb-sub">Log a non-member wash</div></div>
                    <div className="adm-qb-arrow">→</div>
                  </button>
                  <button className="adm-quick-btn" onClick={() => setView("members")}>
                    <div className="adm-qb-icon adm-si-gold">👥</div>
                    <div className="adm-qb-text"><div className="adm-qb-title">View All Members</div><div className="adm-qb-sub">Browse and manage accounts</div></div>
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

            {/* QR Scanner */}
            {scannerOpen ? (
              <div className="qr-scanner-wrap">
                <div className="qr-scanner-viewport">
                  <div id="qr-reader" ref={scannerRef} />
                </div>
                <button className="qr-scanner-close" onClick={stopScanner}>✕ Close Camera</button>
              </div>
            ) : (
              <button className="adm-scan-btn" onClick={startScanner}>📷 &nbsp;Scan QR Code</button>
            )}

            {scanError && (
              <div className="qr-scan-error">{scanError}</div>
            )}

            <div className="adm-lookup-or">or search manually</div>

            <div className="adm-lookup-search-wrap">
              <div className="adm-lookup-search-icon">🔍</div>
              <input type="text" className="adm-lookup-search" placeholder="Plate, name, or phone number..." value={lookupQuery} onChange={(e) => { setLookupQuery(e.target.value); setCheckedIn(false); setScanError(""); }} />
            </div>
            <div className="adm-lookup-hint">
              {lookupResults.length > 1 ? `${lookupResults.length} members found — refine your search` : "Search by plate number, name, or phone"}
            </div>

            {lookupResults.length > 1 && !lookupMember && (
              <div className="adm-lookup-result">
                {lookupResults.map((m) => (
                  <div key={m.id} className="adm-checkin-row" style={{ cursor: "pointer", background: "white", marginBottom: "8px", borderRadius: "12px", border: "1px solid #E8E8EE" }} onClick={() => selectLookupMember(m)}>
                    <div className="adm-checkin-avatar">{getInitials(m.firstName, m.lastName)}</div>
                    <div className="adm-checkin-info">
                      <div className="adm-checkin-name">{m.firstName} {m.lastName}</div>
                      <div className="adm-checkin-detail">{m.make} {m.model} · {m.color} · {m.plate}</div>
                    </div>
                    <div className={`adm-checkin-plan ${PLAN_CLASS[m.plan]}`}>{PLAN_LABEL[m.plan]}</div>
                  </div>
                ))}
              </div>
            )}

            {lookupMember && (
              <div className="adm-lookup-result">
                <div className="adm-result-card">
                  <div className="adm-result-status" style={
                    lookupMember.status === "paused" ? { background: "#FFFBEB" } :
                    lookupMember.status === "cancelled" ? { background: "#FEF0F0" } : {}
                  }>
                    <div className="adm-result-status-left" style={
                      lookupMember.status === "paused" ? { color: "#F59E0B" } :
                      lookupMember.status === "cancelled" ? { color: "#D4202C" } : {}
                    }>
                      <div className="adm-result-status-dot" style={
                        lookupMember.status === "paused" ? { background: "#F59E0B", animation: "none" } :
                        lookupMember.status === "cancelled" ? { background: "#D4202C", animation: "none" } : {}
                      } />
                      {lookupMember.status === "active" ? "Active Membership" : lookupMember.status === "paused" ? "⏸ Membership Paused" : "Membership Cancelled"}
                    </div>
                    <div className={`adm-result-plan-badge ${PLAN_CLASS[lookupMember.plan]}`}>
                      {lookupMember.plan === "premium" ? "⭐ " : ""}{PLAN_LABEL[lookupMember.plan]}
                    </div>
                  </div>
                  <div className="adm-result-body">
                    <div className="adm-result-row">
                      <div className="adm-result-avatar">{getInitials(lookupMember.firstName, lookupMember.lastName)}</div>
                      <div>
                        <div className="adm-result-name">{lookupMember.firstName} {lookupMember.lastName}</div>
                        <div className="adm-result-id">Member for {getMemberDuration(lookupMember.memberSince)} · Since {lookupMember.memberSince}</div>
                      </div>
                    </div>

                    <div className="adm-result-details">
                      <div className="adm-rd-item"><div className="adm-rd-label">Plan</div><div className="adm-rd-value">{lookupMember.planName} — ${(lookupMember.price + lookupMember.surcharge).toFixed(2)}/mo</div></div>
                      <div className="adm-rd-item"><div className="adm-rd-label">Washes This Month</div><div className="adm-rd-value">{lookupVisitCount} washes</div></div>
                      <div className="adm-rd-item"><div className="adm-rd-label">Phone</div><div className="adm-rd-value">{lookupMember.phone}</div></div>
                      <div className="adm-rd-item"><div className="adm-rd-label">Email</div><div className="adm-rd-value">{lookupMember.email}</div></div>
                    </div>

                    <div className="adm-result-vehicle">
                      <div className="adm-rv-icon">{lookupMember.vehicleType === "suv" ? "🚙" : lookupMember.vehicleType === "van" ? "🚐" : "🚗"}</div>
                      <div className="adm-rv-info">
                        <div className="adm-rv-name">{lookupMember.make} {lookupMember.model}</div>
                        <div className="adm-rv-meta">{lookupMember.color} · {lookupMember.vehicleType}</div>
                      </div>
                      <div className="adm-rv-plate">{lookupMember.plate}</div>
                    </div>

                    <div className="adm-result-actions">
                      {checkedIn ? (
                        <button className="adm-ra-btn adm-ra-green" disabled style={{ opacity: 0.7 }}>✓ Checked In — {getServiceType(lookupMember.plan)}</button>
                      ) : lookupMember.status !== "active" ? (
                        <button className="adm-ra-btn" style={{ background: "#F5F5F5", color: "#9CA3AF", cursor: "not-allowed" }} disabled>
                          {lookupMember.status === "paused" ? "⏸ Membership Paused — Cannot Check In" : "Membership Cancelled"}
                        </button>
                      ) : (
                        <button className="adm-ra-btn adm-ra-green" onClick={handleCheckIn} disabled={checkingIn}
                          style={checkingIn ? { opacity: 0.6 } : {}}>
                          {checkingIn ? "Checking in..." : `✓ Check In — ${getServiceType(lookupMember.plan)}`}
                        </button>
                      )}
                      <button className="adm-ra-btn adm-ra-outline" onClick={() => { setLookupMember(null); setCheckedIn(false); setScanError(""); }}>
                        ← Scan Another
                      </button>
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
              <h1>All Members ({members.length})</h1>
              <input type="text" className="adm-members-search" placeholder="Search members..." value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} />
            </div>

            <div className="adm-table">
              <div className="adm-table-header adm-table-7col">
                <div>Member</div>
                <div>Vehicle</div>
                <div>Plan</div>
                <div>Price</div>
                <div>Member For</div>
                <div>Visits</div>
                <div>Status</div>
              </div>
              {filteredMembers.length === 0 && (
                <div style={{ padding: "32px 24px", textAlign: "center", color: "#9CA3AF", fontSize: "14px" }}>
                  {loading ? "Loading members..." : memberSearch ? "No members match your search." : "No members yet."}
                </div>
              )}
              {filteredMembers.map((m) => (
                <div className="adm-table-row adm-table-7col" key={m.id}>
                  <div className="adm-table-member">
                    <div className="adm-table-avatar">{getInitials(m.firstName, m.lastName)}</div>
                    <div>
                      <div className="adm-table-name">{m.firstName} {m.lastName}</div>
                      <div className="adm-table-email">{m.email}</div>
                    </div>
                  </div>
                  <div>
                    <div className="adm-table-vehicle">{m.make} {m.model}</div>
                    <div className="adm-table-plate">{m.plate}</div>
                  </div>
                  <div><span className={`adm-table-plan ${PLAN_CLASS[m.plan]}`}>{PLAN_LABEL[m.plan]}</span></div>
                  <div className="adm-table-visits">${(m.price + m.surcharge).toFixed(2)}</div>
                  <div className="adm-table-duration">{getMemberDuration(m.memberSince)}</div>
                  <div className="adm-table-visits">{m.id ? (visitCounts[m.id] || 0) : 0}</div>
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