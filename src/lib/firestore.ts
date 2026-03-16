import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
  } from "firebase/firestore";
  import { db } from "./firebase";
  
  /* ===== TYPES ===== */
  export interface Member {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    plan: "essential" | "premium" | "ultimate";
    planName: string;
    price: number;
    status: "active" | "paused" | "cancelled";
    vehicleType: "sedan" | "suv" | "van";
    make: string;
    model: string;
    color: string;
    plate: string;
    surcharge: number;
    memberSince: string;
    nextBilling: string;
    createdAt?: Timestamp;
  }
  
  export interface Visit {
    id?: string;
    memberId: string;
    memberName: string;
    memberInitials: string;
    serviceType: string;
    plan: string;
    vehicleInfo: string;
    date: Timestamp;
    checkedInBy?: string;
  }
  
  /* ===== REFERENCES ===== */
  const membersRef = collection(db, "members");
  const visitsRef = collection(db, "visits");
  
  /* ===== MEMBER OPERATIONS ===== */
  
  /** Create a new member from signup */
  export async function createMember(data: Omit<Member, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(membersRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
  
  /** Get a single member by ID */
  export async function getMember(memberId: string): Promise<Member | null> {
    const snap = await getDoc(doc(db, "members", memberId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Member;
  }
  
  /** Get all members */
  export async function getAllMembers(): Promise<Member[]> {
    const snap = await getDocs(query(membersRef, orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Member));
  }
  
  /** Search members by plate, name, or phone */
  export async function searchMembers(searchQuery: string): Promise<Member[]> {
    // Firestore doesn't support full-text search, so we fetch all and filter client-side
    // For production, use Algolia or a Cloud Function with search indexing
    const all = await getAllMembers();
    const q = searchQuery.toLowerCase();
    return all.filter(
      (m) =>
        m.plate.toLowerCase().includes(q) ||
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.email.toLowerCase().includes(q)
    );
  }
  
  /** Look up member by license plate (exact match, case-insensitive) */
  export async function getMemberByPlate(plate: string): Promise<Member | null> {
    const snap = await getDocs(
      query(membersRef, where("plate", "==", plate.toUpperCase()))
    );
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Member;
  }
  
  /** Update member fields */
  export async function updateMember(memberId: string, data: Partial<Member>): Promise<void> {
    await updateDoc(doc(db, "members", memberId), data);
  }
  
  /** Update member status (active, paused, cancelled) */
  export async function updateMemberStatus(
    memberId: string,
    status: "active" | "paused" | "cancelled"
  ): Promise<void> {
    await updateDoc(doc(db, "members", memberId), { status });
  }
  
  /** Update member vehicle info */
  export async function updateMemberVehicle(
    memberId: string,
    vehicle: { vehicleType: string; make: string; model: string; color: string; plate: string; surcharge: number }
  ): Promise<void> {
    await updateDoc(doc(db, "members", memberId), vehicle);
  }
  
  /** Update member plan */
  export async function updateMemberPlan(
    memberId: string,
    plan: "essential" | "premium" | "ultimate",
    planName: string,
    price: number
  ): Promise<void> {
    await updateDoc(doc(db, "members", memberId), { plan, planName, price });
  }
  
  /** Delete a member */
  export async function deleteMember(memberId: string): Promise<void> {
    await deleteDoc(doc(db, "members", memberId));
  }
  
  /** Get active member count */
  export async function getActiveMemberCount(): Promise<number> {
    const snap = await getDocs(query(membersRef, where("status", "==", "active")));
    return snap.size;
  }
  
  /* ===== VISIT / CHECK-IN OPERATIONS ===== */
  
  /** Log a check-in visit */
  export async function logVisit(data: Omit<Visit, "id" | "date">): Promise<string> {
    const docRef = await addDoc(visitsRef, {
      ...data,
      date: serverTimestamp(),
    });
    return docRef.id;
  }
  
  /** Get visits for a specific member */
  export async function getMemberVisits(memberId: string, max: number = 10): Promise<Visit[]> {
    const snap = await getDocs(
      query(visitsRef, where("memberId", "==", memberId), orderBy("date", "desc"), limit(max))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Visit));
  }
  
  /** Get today's visits (for admin dashboard) */
  export async function getTodaysVisits(): Promise<Visit[]> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
  
    const snap = await getDocs(
      query(visitsRef, where("date", ">=", Timestamp.fromDate(startOfDay)), orderBy("date", "desc"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Visit));
  }
  
  /** Get visit count for a member this month */
  export async function getMonthlyVisitCount(memberId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
  
    const snap = await getDocs(
      query(
        visitsRef,
        where("memberId", "==", memberId),
        where("date", ">=", Timestamp.fromDate(startOfMonth))
      )
    );
    return snap.size;
  }
  
  /* ===== DASHBOARD STATS ===== */
  
  /** Get stats for admin dashboard */
  export async function getDashboardStats(): Promise<{
    activeMembers: number;
    todaysWashes: number;
    memberWashesToday: number;
    mrr: number;
  }> {
    // Active members
    const activeSnap = await getDocs(query(membersRef, where("status", "==", "active")));
    const activeMembers = activeSnap.size;
  
    // Calculate MRR from active members
    let mrr = 0;
    activeSnap.docs.forEach((d) => {
      const data = d.data();
      mrr += (data.price || 0) + (data.surcharge || 0);
    });
  
    // Today's visits
    const todaysVisits = await getTodaysVisits();
    const todaysWashes = todaysVisits.length;
    const memberWashesToday = todaysVisits.filter((v) => v.memberId).length;
  
    return { activeMembers, todaysWashes, memberWashesToday, mrr };
  }

/** Get total visit counts for all members (returns map of memberId -> count) */
export async function getAllVisitCounts(): Promise<Record<string, number>> {
  const snap = await getDocs(collection(db, "visits"));
  const counts: Record<string, number> = {};
  snap.docs.forEach((d) => {
    const memberId = d.data().memberId;
    if (memberId) {
      counts[memberId] = (counts[memberId] || 0) + 1;
    }
  });
  return counts;
}

/** Look up member by phone number */
export async function getMemberByPhone(phone: string): Promise<Member | null> {
  const digits = phone.replace(/\D/g, "");
  const snap = await getDocs(query(membersRef, where("phone", "==", digits)));
  if (!snap.empty) {
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as Member;
  }
  const snap2 = await getDocs(query(membersRef, where("phone", "==", phone)));
  if (!snap2.empty) {
    const d = snap2.docs[0];
    return { id: d.id, ...d.data() } as Member;
  }
  return null;
}

/** Look up member by email */
export async function getMemberByEmail(email: string): Promise<Member | null> {
  const snap = await getDocs(
    query(membersRef, where("email", "==", email.toLowerCase().trim()))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Member;
}