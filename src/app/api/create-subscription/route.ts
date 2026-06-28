import { NextRequest, NextResponse } from "next/server";
import { getServerStripe } from "@/lib/stripe";

const PLAN_PRICES: Record<string, { name: string; monthly: number; annual: number }> = {
  essential: { name: "Essential", monthly: 3499, annual: 34999 },
  premium: { name: "Premium", monthly: 4999, annual: 49999 },
  ultimate: { name: "Ultimate", monthly: 6499, annual: 64999 },
};

const PROMO_PRICE = 1499; // $14.99 first month — monthly only

export async function POST(req: NextRequest) {
  try {
    const stripe = getServerStripe();
    const body = await req.json();

    const {
      plan, interval, firstName, lastName, email, phone,
      vehicleType, make, model, color, plate, surcharge,
    } = body;

    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing customer info" }, { status: 400 });
    }

    const isAnnual = interval === "annual";
    const planData = PLAN_PRICES[plan];

    // Calculate amount based on interval
    let amount: number;
    let stripeInterval: "month" | "year";

    if (isAnnual) {
      // Annual: base annual price + surcharge × 12
      amount = planData.annual + (surcharge ? surcharge * 100 * 12 : 0);
      stripeInterval = "year";
    } else {
      // Monthly: base monthly price + surcharge
      amount = planData.monthly + (surcharge ? surcharge * 100 : 0);
      stripeInterval = "month";
    }

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`,
      phone,
      metadata: { vehicleType, make, model, color, plate },
    });

    // Create recurring price
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: amount,
      recurring: { interval: stripeInterval },
      product_data: {
        name: `Majestic Car Wash — ${planData.name} Membership (${isAnnual ? "Annual" : "Monthly"})`,
        metadata: { plan, interval: stripeInterval },
      },
    });

    // First-month promo coupon — monthly only, not annual
    let couponId: string | undefined;
    if (!isAnnual) {
      const monthlyAmount = planData.monthly + (surcharge ? surcharge * 100 : 0);
      const discountAmount = monthlyAmount - PROMO_PRICE;
      if (discountAmount > 0) {
        const coupon = await stripe.coupons.create({
          amount_off: discountAmount,
          currency: "usd",
          duration: "once",
          name: "First Month Promo — $14.99",
        });
        couponId = coupon.id;
      }
    }

    // Create subscription
    const monthlyEquiv = isAnnual
      ? (planData.annual / 12 / 100).toFixed(2)
      : ((planData.monthly + (surcharge ? surcharge * 100 : 0)) / 100).toFixed(2);

    const subscriptionParams: any = {
      customer: customer.id,
      items: [{ price: price.id }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
      metadata: {
        plan, planName: planData.name,
        interval: stripeInterval,
        price: monthlyEquiv,
        totalAmount: (amount / 100).toFixed(2),
        firstName, lastName, email, phone,
        vehicleType, make, model, color,
        plate: plate.toUpperCase(),
        surcharge: String(surcharge || 0),
      },
    };

    if (couponId) {
      subscriptionParams.discounts = [{ coupon: couponId }];
    }

    const subscription = await stripe.subscriptions.create(subscriptionParams);
    const invoice = subscription.latest_invoice as any;
    const paymentIntent = invoice.payment_intent as any;

    return NextResponse.json({
      subscriptionId: subscription.id,
      customerId: customer.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Subscription creation failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create subscription" },
      { status: 500 }
    );
  }
}