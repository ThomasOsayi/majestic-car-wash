import { NextRequest, NextResponse } from "next/server";
import { getServerStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const stripe = getServerStripe();
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const subscription = session.subscription as any;
    const customer = session.customer as any;

    // Get member data from subscription metadata
    const meta = subscription?.metadata || {};

    // Calculate next billing date
    const currentPeriodEnd = subscription?.current_period_end;
    const nextBilling = currentPeriodEnd
      ? new Date(currentPeriodEnd * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

    return NextResponse.json({
      verified: true,
      customerId: customer?.id || session.customer,
      subscriptionId: subscription?.id,
      plan: meta.plan || "",
      planName: meta.planName || "",
      price: parseFloat(meta.price || "0"),
      firstName: meta.firstName || "",
      lastName: meta.lastName || "",
      email: meta.email || customer?.email || "",
      phone: meta.phone || "",
      vehicleType: meta.vehicleType || "sedan",
      make: meta.make || "",
      model: meta.model || "",
      color: meta.color || "",
      plate: meta.plate || "",
      surcharge: parseInt(meta.surcharge || "0"),
      nextBilling,
    });
  } catch (error: any) {
    console.error("Session verification failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify session" },
      { status: 500 }
    );
  }
}