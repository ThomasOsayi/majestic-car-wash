"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  getAllMembers,
  searchMembers,
  getDashboardStats,
  getTodaysVisits,
  getMonthlyTotalVisits,
  logVisit,
  getMember,
  getMonthlyVisitCount,
  getAllVisitCounts,
  type Member,
  type Visit,
} from "@/lib/firestore";

const PLAN_CLASS: Record<string, string> = { essential: "adm-plan-essential", premium: "adm-plan-premium", ultimate: "adm-plan-ultimate" };
const PLAN_LABEL: Record<string, string> = { essential: "Essential", premium: "Premium", ultimate: "Ultimate" };

function getInitials(f: string, l: string) { return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase(); }
function getServiceType(plan: string) { return plan === "essential" ? "Exterior Hand Wash" : plan === "ultimate" ? "Full-Service + Detail" : "Full-Service Wash"; }

/** Get the monthly equivalent price for MRR calculation */
function getMonthlyPrice(member: Member): number {
  const isAnnual = member.billingInterval === "annual";
  const basePrice = isAnnual ? member.price / 12 : member.price;
  const surcharge = isAnnual ? (member.surcharge || 0) : (member.surcharge || 0);
  return basePrice + surcharge;
}

/** Format price display based on billing interval */
function formatMemberPrice(member: Member): string {
  const isAnnual = member.billingInterval === "annual";
  const total = member.price + (isAnnual ? (member.surcharge || 0) * 12 : (member.surcharge || 0));
  return isAnnual ? `$${total.toFixed(2)}/yr` : `$${total.toFixed(2)}/mo`;
}

/** Get interval label */
function getIntervalLabel(member: Member): string {
  return member.billingInterval === "annual" ? "Annual" : "Monthly";
}

function getMemberDuration(memberSince: string, createdAt?: any): string {
  if (createdAt?.toDate) {
    const join = createdAt.toDate();
    const diff = Math.floor((Date.now() - join.getTime()) / 86400000);
    if (diff < 1) return "Today";
    if (diff < 30) return `${diff}d`;
    const mo = Math.floor(diff / 30);
    if (mo < 12) return `${mo} mo${mo !== 1 ? "s" : ""}`;
    const yr = Math.floor(mo / 12), rm = mo % 12;
    return rm > 0 ? `${yr}y ${rm}mo` : `${yr}y`;
  }
  if (!memberSince) return "—";
  const parts = memberSince.split(" ");
  if (parts.length < 2) return memberSince;
  const mi = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(parts[0]);
  const yr = parseInt(parts[1]);
  if (mi === -1 || isNaN(yr)) return memberSince;
  const diff = Math.floor((Date.now() - new Date(yr, mi, 1).getTime()) / 86400000);
  if (diff < 1) return "Today";
  if (diff < 30) return `${diff}d`;
  const mo = Math.floor(diff / 30);
  if (mo < 12) return `${mo} mo${mo !== 1 ? "s" : ""}`;
  const y = Math.floor(mo / 12), r = mo % 12;
  return r > 0 ? `${y}y ${r}mo` : `${y}y`;
}

const IconGrid = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.5" fill="currentColor"/><rect x="9" y="2" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.5"/><rect x="2" y="9" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.5"/><rect x="9" y="9" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.3"/></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 8l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/></svg>;
const IconUsers = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" fill="currentColor"/><circle cx="11" cy="5" r="2" fill="currentColor" opacity="0.4"/><path d="M1 14c0-2.8 2.2-5 5-5s5 2.2 5 5" fill="currentColor" opacity="0.3"/></svg>;
const IconQR = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7z" fill="currentColor"/><rect x="14" y="14" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4"/></svg>;
const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconGroup = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="17" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="currentColor" strokeWidth="2"/></svg>;

export default function AdminPage() {
  const [view, setView] = useState<"dashboard" | "lookup" | "members">("dashboard");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ activeMembers: 0, todaysWashes: 0, memberWashesToday: 0, mrr: 0 });
  const [mrrBreakdown, setMrrBreakdown] = useState({ essential: { count: 0, monthly: 0, annual: 0 }, premium: { count: 0, monthly: 0, annual: 0 }, ultimate: { count: 0, monthly: 0, annual: 0 }, surcharges: 0 });
  const [monthlyVisits, setMonthlyVisits] = useState(0);
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

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanError, setScanError] = useState("");
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5ScannerRef = useRef<any>(null);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
  const lastUpdated = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const loadDashboard = useCallback(async () => {
    try {
      const [s, visits, mvCount, allMbrs] = await Promise.all([
        getDashboardStats(), getTodaysVisits(), getMonthlyTotalVisits(), getAllMembers()
      ]);
      setStats(s);
      setRecentVisits(visits);
      setMonthlyVisits(mvCount);

      // Compute MRR breakdown — normalize annual to monthly
      const breakdown = {
        essential: { count: 0, monthly: 0, annual: 0 },
        premium: { count: 0, monthly: 0, annual: 0 },
        ultimate: { count: 0, monthly: 0, annual: 0 },
        surcharges: 0,
      };
      allMbrs.filter(m => m.status === "active").forEach(m => {
        const tier = m.plan as "essential" | "premium" | "ultimate";
        if (breakdown[tier] !== undefined) {
          breakdown[tier].count++;
          const isAnnual = m.billingInterval === "annual";
          if (isAnnual) {
            // Annual: normalize to monthly equivalent
            breakdown[tier].annual++;
            breakdown[tier].monthly += 0; // track counts only
          } else {
            breakdown[tier].monthly += 0;
          }
        }
        // Surcharges are always monthly
        breakdown.surcharges += m.surcharge || 0;
      });
      setMrrBreakdown(breakdown);
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
    async function init() { setLoading(true); await Promise.all([loadDashboard(), loadMembers()]); setLoading(false); }
    init();
  }, [loadDashboard, loadMembers]);

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

  useEffect(() => { return () => { stopScanner(); }; }, []);
  useEffect(() => { if (view !== "lookup") stopScanner(); }, [view]);

  async function selectLookupMember(member: Member) {
    setLookupMember(member); setCheckedIn(false);
    if (member.id) { const count = await getMonthlyVisitCount(member.id); setLookupVisitCount(count); }
  }

  async function handleCheckIn() {
    if (!lookupMember?.id || checkingIn) return;
    setCheckingIn(true);
    try {
      await logVisit({ memberId: lookupMember.id, memberName: `${lookupMember.firstName} ${lookupMember.lastName}`, memberInitials: getInitials(lookupMember.firstName, lookupMember.lastName), serviceType: getServiceType(lookupMember.plan), plan: lookupMember.plan, vehicleInfo: `${lookupMember.make} ${lookupMember.model} · ${lookupMember.color} · ${lookupMember.plate}` });
      setCheckedIn(true); setLookupVisitCount(prev => prev + 1); loadDashboard();
    } catch (err) { console.error("Check-in failed:", err); alert("Check-in failed. Please try again."); }
    finally { setCheckingIn(false); }
  }

  async function startScanner() {
    setScanError(""); setScannerOpen(true); setLookupMember(null); setLookupResults([]); setLookupQuery(""); setCheckedIn(false);
    await new Promise(r => setTimeout(r, 100));
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (html5ScannerRef.current) { try { await html5ScannerRef.current.stop(); } catch {} html5ScannerRef.current = null; }
      const scanner = new Html5Qrcode("qr-reader");
      html5ScannerRef.current = scanner;
      let handled = false;
      await scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        (decodedText: string) => {
          if (handled) return; handled = true;
          setScannerOpen(false); setScanError("");
          const memberId = decodedText.startsWith("MCW:") ? decodedText.slice(4) : decodedText;
          if (html5ScannerRef.current) { html5ScannerRef.current.stop().catch(() => {}); html5ScannerRef.current = null; }
          getMember(memberId).then(member => { if (member) { setScanError(""); selectLookupMember(member); } else { setScanError("No member found for this QR code."); } }).catch(() => { setScanError("Failed to look up member. Please try again."); });
        }, () => {}
      );
    } catch (err: any) {
      console.error("Scanner error:", err); setScannerOpen(false);
      if (err?.message?.includes("NotAllowedError") || err?.name === "NotAllowedError") setScanError("Camera access denied.");
      else if (err?.message?.includes("NotFoundError") || err?.name === "NotFoundError") setScanError("No camera found.");
      else setScanError("Could not start camera. Try manual search.");
    }
  }

  async function stopScanner() { if (html5ScannerRef.current) { try { await html5ScannerRef.current.stop(); } catch {} html5ScannerRef.current = null; } setScannerOpen(false); }

  const filteredMembers = memberSearch ? members.filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(memberSearch.toLowerCase()) || m.plate.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase())) : members;

  function formatVisitTime(v: Visit) { if (!v.date?.toDate) return ""; return v.date.toDate().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); }

  // Compute real MRR from active members — normalize annual to monthly
  const activeMembers = members.filter(m => m.status === "active");
  const totalMrr = activeMembers.reduce((sum, m) => sum + getMonthlyPrice(m), 0);

  // MRR per tier (monthly equivalent)
  const mrrByTier = { essential: 0, premium: 0, ultimate: 0, surcharges: 0 };
  const countByTier = { essential: { total: 0, monthly: 0, annual: 0 }, premium: { total: 0, monthly: 0, annual: 0 }, ultimate: { total: 0, monthly: 0, annual: 0 } };
  activeMembers.forEach(m => {
    const tier = m.plan as "essential" | "premium" | "ultimate";
    const isAnnual = m.billingInterval === "annual";
    const monthlyEquiv = isAnnual ? m.price / 12 : m.price;
    if (mrrByTier[tier] !== undefined) {
      mrrByTier[tier] += monthlyEquiv;
      countByTier[tier].total++;
      if (isAnnual) countByTier[tier].annual++;
      else countByTier[tier].monthly++;
    }
    mrrByTier.surcharges += m.surcharge || 0;
  });

  return (
    <div className="adm2">
      <nav className="a2-nav">
        <div className="a2-nav-left">
          <Link href="/" className="a2-logo"><div className="a2-logo-icon">M</div><span className="a2-logo-text">Majestic</span></Link>
          <div className="a2-nav-divider" />
          <div className="a2-nav-tabs">
            <button className={`a2-tab${view === "dashboard" ? " active" : ""}`} onClick={() => { setView("dashboard"); loadDashboard(); }}>
              <span className="a2-tab-chip a2-tc-red"><IconGrid /></span>Dashboard
            </button>
            <button className={`a2-tab${view === "lookup" ? " active" : ""}`} onClick={() => setView("lookup")}>
              <span className="a2-tab-chip a2-tc-green"><IconCheck /></span>Check-In
            </button>
            <button className={`a2-tab${view === "members" ? " active" : ""}`} onClick={() => { setView("members"); loadMembers(); }}>
              <span className="a2-tab-chip a2-tc-blue"><IconUsers /></span>Members
            </button>
          </div>
        </div>
        <div className="a2-nav-right">
          <span className="a2-nav-date">{today}</span>
          <div className="a2-nav-user"><div className="a2-nav-avatar">JV</div><span className="a2-nav-name">Javier</span></div>
        </div>
      </nav>

      <div className="a2-content">

        {/* ===== DASHBOARD ===== */}
        {view === "dashboard" && (
          <div className="a2-view">
            <div className="a2-updated">Last updated {lastUpdated}</div>

            <div className="a2-stat-row">
              <div className="a2-stat">
                <div className="a2-stat-label">Check-Ins Today</div>
                <div className="a2-stat-number">{loading ? "—" : stats.todaysWashes}</div>
                <div className="a2-stat-sub">member washes logged today</div>
              </div>
              <div className="a2-stat">
                <div className="a2-stat-label">Active Members</div>
                <div className="a2-stat-number">{loading ? "—" : activeMembers.length}</div>
                <div className="a2-stat-sub">
                  {!loading && activeMembers.length > 0 &&
                    `${countByTier.essential.total} Ess · ${countByTier.premium.total} Pre · ${countByTier.ultimate.total} Ult`
                  }
                </div>
              </div>
              <div className="a2-stat">
                <div className="a2-stat-label">Monthly Recurring Revenue</div>
                <div className="a2-stat-number">{loading ? "—" : `$${totalMrr.toFixed(2)}`}</div>
                {!loading && (
                  <div className="a2-mrr-detail">
                    {(["essential", "premium", "ultimate"] as const).map(tier => {
                      const count = countByTier[tier];
                      const intervalNote = count.annual > 0 && count.monthly > 0
                        ? ` (${count.monthly}mo, ${count.annual}yr)`
                        : count.annual > 0 ? ` (${count.annual} annual)` : "";
                      return (
                        <div className="a2-mrr-row" key={tier}>
                          <span>{PLAN_LABEL[tier]} ({count.total}){intervalNote}</span>
                          <strong>${mrrByTier[tier].toFixed(2)}/mo</strong>
                        </div>
                      );
                    })}
                    <div className="a2-mrr-row"><span>Surcharges</span><strong>${mrrByTier.surcharges.toFixed(2)}/mo</strong></div>
                  </div>
                )}
              </div>
              <div className="a2-stat">
                <div className="a2-stat-label">Washes This Month</div>
                <div className="a2-stat-number">{loading ? "—" : monthlyVisits}</div>
                <div className="a2-stat-sub">total member check-ins in {new Date().toLocaleDateString("en-US", { month: "long" })}</div>
              </div>
            </div>

            <div className="a2-dash-grid">
              <div className="a2-card">
                <div className="a2-card-head"><span className="a2-card-title">Recent Check-Ins</span><a className="a2-card-action" onClick={() => setView("lookup")}>Open Check-In →</a></div>
                <div>
                  {recentVisits.length === 0 && !loading && <div className="a2-empty">No check-ins yet today.</div>}
                  {recentVisits.slice(0, 8).map((v, i) => (
                    <div className="a2-ci-row" key={v.id || i}>
                      <div className="a2-ci-time">{formatVisitTime(v)}</div>
                      <div className="a2-ci-avatar">{v.memberInitials}</div>
                      <div className="a2-ci-info"><div className="a2-ci-name">{v.memberName}</div><div className="a2-ci-meta">{v.vehicleInfo}</div></div>
                      <div className={`a2-ci-plan ${PLAN_CLASS[v.plan] || ""}`}>{PLAN_LABEL[v.plan] || v.plan}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="a2-card">
                <div className="a2-card-head"><span className="a2-card-title">Quick Actions</span></div>
                <div className="a2-act-list">
                  <button className="a2-act-btn" onClick={() => { setView("lookup"); setTimeout(startScanner, 200); }}>
                    <div className="a2-act-icon a2-ai-red"><IconQR /></div>
                    <div className="a2-act-text"><div className="a2-act-title">Scan QR Code</div><div className="a2-act-sub">Verify member at check-in</div></div>
                    <div className="a2-act-arrow">→</div>
                  </button>
                  <button className="a2-act-btn" onClick={() => setView("lookup")}>
                    <div className="a2-act-icon a2-ai-blue"><IconSearch /></div>
                    <div className="a2-act-text"><div className="a2-act-title">Look Up Member</div><div className="a2-act-sub">Search by plate, name, or phone</div></div>
                    <div className="a2-act-arrow">→</div>
                  </button>
                  <button className="a2-act-btn" onClick={() => setView("members")}>
                    <div className="a2-act-icon a2-ai-gold"><IconGroup /></div>
                    <div className="a2-act-text"><div className="a2-act-title">View All Members</div><div className="a2-act-sub">Browse and manage accounts</div></div>
                    <div className="a2-act-arrow">→</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== CHECK-IN ===== */}
        {view === "lookup" && (
          <div className="a2-view">
            <div className="a2-checkin-head"><h1>Member Check-In</h1><p>Scan a QR code or search to verify membership.</p></div>

            {scannerOpen ? (
              <div className="qr-scanner-wrap"><div className="qr-scanner-viewport"><div id="qr-reader" ref={scannerRef} /></div><button className="qr-scanner-close" onClick={stopScanner}>Close Camera</button></div>
            ) : (
              <button className="a2-scan-btn" onClick={startScanner}><IconQR /> Scan QR Code</button>
            )}

            {scanError && <div className="qr-scan-error">{scanError}</div>}

            <div className="a2-divider-or">or search manually</div>

            <div className="a2-search-wrap">
              <div className="a2-search-icon"><IconSearch /></div>
              <input type="text" className="a2-search-input" placeholder="Plate, name, or phone number..." value={lookupQuery} onChange={e => { setLookupQuery(e.target.value); setCheckedIn(false); setScanError(""); }} />
            </div>
            <div className="a2-search-hint">{lookupResults.length > 1 ? `${lookupResults.length} members found — refine your search` : "Search by plate number, name, or phone"}</div>

            {lookupResults.length > 1 && !lookupMember && (
              <div className="a2-lookup-results">
                {lookupResults.map(m => (
                  <div key={m.id} className="a2-ci-row a2-ci-clickable" onClick={() => selectLookupMember(m)}>
                    <div className="a2-ci-avatar">{getInitials(m.firstName, m.lastName)}</div>
                    <div className="a2-ci-info"><div className="a2-ci-name">{m.firstName} {m.lastName}</div><div className="a2-ci-meta">{m.make} {m.model} · {m.color} · {m.plate}</div></div>
                    <div className="a2-plan-with-interval">
                      <span className={`a2-ci-plan ${PLAN_CLASS[m.plan]}`}>{PLAN_LABEL[m.plan]}</span>
                      <span className="a2-interval-tag">{getIntervalLabel(m)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {lookupMember && (
              <div className="a2-result-card">
                <div className={`a2-rb ${lookupMember.status === "active" ? "a2-rb-active" : lookupMember.status === "paused" ? "a2-rb-paused" : "a2-rb-cancelled"}`}>
                  <div className="a2-rb-left"><div className={`a2-rb-dot ${lookupMember.status}`} />{lookupMember.status === "active" ? "Active Membership" : lookupMember.status === "paused" ? "Membership Paused" : "Membership Cancelled"}</div>
                  <div className="a2-plan-with-interval">
                    <span className={`a2-ci-plan ${PLAN_CLASS[lookupMember.plan]}`}>{PLAN_LABEL[lookupMember.plan]}</span>
                    <span className="a2-interval-tag">{getIntervalLabel(lookupMember)}</span>
                  </div>
                </div>
                <div className="a2-result-body">
                  <div className="a2-result-member">
                    <div className="a2-rm-avatar">{getInitials(lookupMember.firstName, lookupMember.lastName)}</div>
                    <div><div className="a2-rm-name">{lookupMember.firstName} {lookupMember.lastName}</div><div className="a2-rm-sub">Member for {getMemberDuration(lookupMember.memberSince, lookupMember.createdAt)} · Since {lookupMember.memberSince}</div></div>
                  </div>
                  <div className="a2-result-stats">
                    <div className="a2-rs">
                      <div className="a2-rs-label">Plan</div>
                      <div className="a2-rs-value a2-gold">
                        {lookupMember.planName} — {formatMemberPrice(lookupMember)}
                        {lookupMember.billingInterval === "annual" && (
                          <div style={{ fontSize: "11px", color: "#8E8E9A", fontWeight: 500, marginTop: "2px" }}>
                            ${getMonthlyPrice(lookupMember).toFixed(2)}/mo effective
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="a2-rs"><div className="a2-rs-label">Washes This Month</div><div className="a2-rs-value">{lookupVisitCount} washes</div></div>
                    <div className="a2-rs"><div className="a2-rs-label">Phone</div><div className="a2-rs-value">{lookupMember.phone}</div></div>
                    <div className="a2-rs"><div className="a2-rs-label">Email</div><div className="a2-rs-value">{lookupMember.email}</div></div>
                  </div>
                  <div className="a2-result-vehicle">
                    <div className="a2-rv-icon">{lookupMember.vehicleType === "suv" ? "🚙" : lookupMember.vehicleType === "van" ? "🚐" : "🚗"}</div>
                    <div className="a2-rv-info"><div className="a2-rv-name">{lookupMember.make} {lookupMember.model}</div><div className="a2-rv-meta">{lookupMember.color} · {lookupMember.vehicleType}</div></div>
                    <div className="a2-rv-plate">{lookupMember.plate}</div>
                  </div>
                  <div className="a2-result-actions">
                    {checkedIn ? (
                      <button className="a2-ra-btn a2-ra-green" disabled style={{ opacity: 0.7 }}>Checked In — {getServiceType(lookupMember.plan)}</button>
                    ) : lookupMember.status !== "active" ? (
                      <button className="a2-ra-btn a2-ra-disabled" disabled>{lookupMember.status === "paused" ? "Membership Paused — Cannot Check In" : "Membership Cancelled"}</button>
                    ) : (
                      <button className="a2-ra-btn a2-ra-green" onClick={handleCheckIn} disabled={checkingIn} style={checkingIn ? { opacity: 0.6 } : {}}>{checkingIn ? "Checking in..." : `Check In — ${getServiceType(lookupMember.plan)}`}</button>
                    )}
                    <button className="a2-ra-btn a2-ra-outline" onClick={() => { setLookupMember(null); setCheckedIn(false); setScanError(""); }}>Scan Another</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== MEMBERS ===== */}
        {view === "members" && (
          <div className="a2-view">
            <div className="a2-members-head"><h1>All Members ({members.length})</h1><input type="text" className="a2-members-search" placeholder="Search members..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)} /></div>

            <div className="a2-table">
              <div className="a2-table-header a2-t7">
                <div>Member</div><div>Vehicle</div><div>Plan</div><div>Price</div><div>Member For</div><div>Visits</div><div>Status</div>
              </div>
              {filteredMembers.length === 0 && <div className="a2-empty">{loading ? "Loading members..." : memberSearch ? "No members match your search." : "No members yet."}</div>}
              {filteredMembers.map(m => (
                <div className="a2-table-row a2-t7" key={m.id}>
                  <div className="a2-tm-member"><div className="a2-tm-avatar">{getInitials(m.firstName, m.lastName)}</div><div><div className="a2-tm-name">{m.firstName} {m.lastName}</div><div className="a2-tm-email">{m.email}</div></div></div>
                  <div><div className="a2-tm-vehicle">{m.make} {m.model}</div><div className="a2-tm-plate">{m.plate}</div></div>
                  <div>
                    <div className="a2-plan-with-interval">
                      <span className={`a2-ci-plan ${PLAN_CLASS[m.plan]}`}>{PLAN_LABEL[m.plan]}</span>
                      <span className="a2-interval-tag">{getIntervalLabel(m)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="a2-tm-price">{formatMemberPrice(m)}</div>
                    {m.billingInterval === "annual" && <div className="a2-tm-price-sub">${getMonthlyPrice(m).toFixed(2)}/mo eff.</div>}
                  </div>
                  <div className="a2-tm-duration">{getMemberDuration(m.memberSince, m.createdAt)}</div>
                  <div className="a2-tm-visits">{m.id ? (visitCounts[m.id] || 0) : 0}</div>
                  <div className="a2-tm-status"><span className={`a2-tm-dot ${m.status === "active" ? "active" : "paused"}`} />{m.status.charAt(0).toUpperCase() + m.status.slice(1)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}