"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import {
  getMember,
  getMemberVisits,
  getMonthlyVisitCount,
  updateMemberStatus,
  type Member,
  type Visit,
} from "@/lib/firestore";

const RETAIL_PRICES: Record<string, number> = {
  essential: 20,
  premium: 30,
  ultimate: 75,
};

function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function getVehicleIcon(type: string) {
  if (type === "suv") return "🚙";
  if (type === "van") return "🚐";
  return "🚗";
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  return `${Math.floor(diffDays / 7)} weeks ago`;
}

function formatVisitDate(visit: Visit): string {
  if (!visit.date?.toDate) return "";
  return visit.date.toDate().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function MemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    async function load() {
      const id = localStorage.getItem("memberId");
      if (!id) {
        router.push("/login");
        return;
      }

      try {
        const m = await getMember(id);
        if (!m) {
          localStorage.removeItem("memberId");
          router.push("/login");
          return;
        }
        setMember(m);

        // Generate real scannable QR code with member ID
        const qrUrl = await QRCode.toDataURL(`MCW:${id}`, {
          width: 280,
          margin: 2,
          color: { dark: "#070E24", light: "#FFFFFF" },
          errorCorrectionLevel: "M",
        });
        setQrDataUrl(qrUrl);

        const [v, count] = await Promise.all([
          getMemberVisits(id, 10),
          getMonthlyVisitCount(id),
        ]);
        setVisits(v);
        setMonthlyCount(count);
      } catch (err) {
        console.error("Failed to load member:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  function handleSignOut() {
    localStorage.removeItem("memberId");
    router.push("/login");
  }

  async function handleCancel() {
    if (!member?.id || cancelling) return;
    setCancelling(true);
    try {
      await updateMemberStatus(member.id, "cancelled");
      setMember((prev) => prev ? { ...prev, status: "cancelled" } : null);
      setShowCancelConfirm(false);
    } catch (err) {
      console.error("Failed to cancel:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  async function handlePause() {
    if (!member?.id) return;
    try {
      await updateMemberStatus(member.id, "paused");
      setMember((prev) => prev ? { ...prev, status: "paused" } : null);
    } catch (err) {
      console.error("Failed to pause:", err);
    }
  }

  async function handleReactivate() {
    if (!member?.id) return;
    try {
      await updateMemberStatus(member.id, "active");
      setMember((prev) => prev ? { ...prev, status: "active" } : null);
    } catch (err) {
      console.error("Failed to reactivate:", err);
    }
  }

  if (loading) {
    return (
      <div className="member-page">
        <div className="member-bg" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "15px" }}>Loading your membership...</div>
        </div>
      </div>
    );
  }

  if (!member) return null;

  const retailPerWash = RETAIL_PRICES[member.plan] || 30;
  const totalMonthly = member.price + member.surcharge;
  const savings = Math.max(0, monthlyCount * retailPerWash - totalMonthly).toFixed(2);
  const initials = getInitials(member.firstName, member.lastName);
  const statusLabel = member.status.charAt(0).toUpperCase() + member.status.slice(1);

  return (
    <div className="member-page">
      <div className="member-bg" />

      <div className="member-topbar">
        <Link href="/" className="member-logo">
          <div className="member-logo-icon">M</div>
          <span>Majestic Car Wash</span>
        </Link>
        <div className="member-topbar-right">
          <button onClick={handleSignOut} className="member-topbar-link" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
            Sign Out
          </button>
          <div className="member-avatar">{initials}</div>
        </div>
      </div>

      <div className="member-wrap">
        <div className="member-greeting">
          <h1>Hey, {member.firstName} 👋</h1>
          <p>Your car&apos;s looking fresh. Here&apos;s your membership at a glance.</p>
        </div>

        <div className="member-grid">
          {/* ===== LEFT: QR Card ===== */}
          <div className="qr-card">
            <div className="qr-status" style={member.status !== "active" ? { background: "rgba(245,158,11,0.12)", color: "#F59E0B" } : {}}>
              <span className="qr-status-dot" style={member.status !== "active" ? { background: "#F59E0B" } : {}} />
              {member.status === "active" ? "Active Member" : statusLabel}
            </div>

            <div className="qr-code">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="Membership QR Code"
                  style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px" }}
                />
              ) : (
                <div style={{ color: "rgba(0,0,0,0.2)", fontSize: "13px" }}>Generating QR...</div>
              )}
            </div>

            <div className="qr-member-name">{member.firstName} {member.lastName}</div>
            <div className="qr-member-id">Member #{member.id?.slice(-8).toUpperCase()}</div>
            <div className="qr-plan-badge">⭐ {member.planName} Member</div>
            <div className="qr-instruction">
              Show this code when you pull up.
              <br />
              Staff will scan to verify your membership.
            </div>
          </div>

          {/* ===== RIGHT: Details ===== */}
          <div className="member-right">

            <div className="member-card">
              <div className="member-card-header">
                <div className="member-card-title">Membership Status</div>
              </div>
              <div className="status-grid">
                <div className="status-item">
                  <div className="status-label">Plan</div>
                  <div className="status-value gold">{member.planName}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Monthly</div>
                  <div className="status-value">${totalMonthly.toFixed(2)}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Next Billing</div>
                  <div className="status-value">{member.nextBilling}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Member Since</div>
                  <div className="status-value">{member.memberSince}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Status</div>
                  <div className={`status-value ${member.status === "active" ? "green" : ""}`}>{statusLabel}</div>
                </div>
                <div className="status-item">
                  <div className="status-label">Vehicle</div>
                  <div className="status-value">{member.plate}</div>
                </div>
              </div>
            </div>

            <div className="member-card">
              <div className="member-card-header">
                <div className="member-card-title">Vehicle on File</div>
                <a className="member-card-action" href="#">Update Vehicle →</a>
              </div>
              <div className="vehicle-row">
                <div className="vehicle-icon-box">{getVehicleIcon(member.vehicleType)}</div>
                <div className="vehicle-info">
                  <div className="vehicle-name">{member.make} {member.model}</div>
                  <div className="vehicle-meta">
                    {member.color} · {member.vehicleType.charAt(0).toUpperCase() + member.vehicleType.slice(1)}
                    {member.surcharge > 0 && " (+$5/mo)"}
                  </div>
                </div>
                <div className="vehicle-plate">{member.plate}</div>
              </div>
            </div>

            <div className="member-card">
              <div className="member-card-header">
                <div className="member-card-title">Recent Visits</div>
              </div>
              <div className="visit-list">
                {visits.length === 0 ? (
                  <div style={{ padding: "24px 0", textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "14px" }}>
                    No visits yet. Drive in anytime — just show your QR code!
                  </div>
                ) : (
                  visits.map((v, i) => (
                    <div className="visit-item" key={v.id || i}>
                      <div className="visit-left">
                        <div className="visit-dot" />
                        <div>
                          <div className="visit-date">{formatVisitDate(v)}</div>
                          <div className="visit-type">{v.serviceType}</div>
                        </div>
                      </div>
                      <div className="visit-badge">{v.date?.toDate ? timeAgo(v.date.toDate()) : ""}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="visit-count-bar">
                <div className="visit-count-text">
                  <strong>{monthlyCount} wash{monthlyCount !== 1 ? "es" : ""}</strong> this month
                </div>
                <div className="visit-savings">
                  {parseFloat(savings) > 0 ? `Saving $${savings} vs retail` : "Wash more to save!"}
                </div>
              </div>
            </div>

            <div className="member-card">
              <div className="member-card-header">
                <div className="member-card-title">Manage Subscription</div>
              </div>

              {member.status === "cancelled" ? (
                <div className="cancel-confirm">
                  <div className="cancel-confirm-text">Your membership has been cancelled. You can rejoin anytime.</div>
                  <div className="cancel-confirm-btns">
                    <Link href="/signup" className="manage-btn manage-upgrade" style={{ textDecoration: "none", textAlign: "center" }}>Rejoin Majestic →</Link>
                  </div>
                </div>
              ) : member.status === "paused" ? (
                <div className="cancel-confirm">
                  <div className="cancel-confirm-text">Your membership is paused. No charges during pause. Reactivate anytime to start washing again.</div>
                  <div className="cancel-confirm-btns">
                    <button className="manage-btn manage-upgrade" onClick={handleReactivate}>▶ Reactivate Membership</button>
                  </div>
                </div>
              ) : !showCancelConfirm ? (
                <div className="manage-actions">
                  {member.plan !== "ultimate" && <button className="manage-btn manage-upgrade">⬆ Upgrade to Ultimate</button>}
                  <button className="manage-btn manage-outline">Update Payment</button>
                  <button className="manage-btn manage-outline" onClick={handlePause}>Pause Membership</button>
                  <button className="manage-btn manage-danger" onClick={() => setShowCancelConfirm(true)}>Cancel</button>
                </div>
              ) : (
                <div className="cancel-confirm">
                  <div className="cancel-confirm-text">
                    <strong>Are you sure?</strong> You&apos;ll lose unlimited washes
                    {parseFloat(savings) > 0 && ` and your $${savings} monthly savings`}.
                    Your membership stays active until {member.nextBilling}.
                  </div>
                  <div className="cancel-confirm-btns">
                    <button className="manage-btn manage-outline" onClick={() => setShowCancelConfirm(false)}>Keep My Membership</button>
                    <button className="manage-btn manage-danger" onClick={handleCancel} disabled={cancelling}>
                      {cancelling ? "Cancelling..." : "Yes, Cancel"}
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