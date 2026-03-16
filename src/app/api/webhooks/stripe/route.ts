import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getServerStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const stripe = getServerStripe();
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`Webhook received: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      console.log("Checkout completed for:", session.customer_email);
      console.log("Subscription ID:", session.subscription);
      // Member creation is handled client-side on the success page
      // This webhook serves as a backup / for production reliability
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any;
      console.log("Payment succeeded for subscription:", invoice.subscription);
      // Could update nextBilling date in Firestore here
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as any;
      console.log("Payment failed for subscription:", invoice.subscription);
      // Could update member status to "past_due" in Firestore here
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      console.log("Subscription cancelled:", subscription.id);
      // Could update member status to "cancelled" in Firestore here
      break;
    }

    default:
      console.log(`Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}