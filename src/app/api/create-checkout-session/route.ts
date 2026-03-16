import { NextRequest, NextResponse } from "next/server";
import { getServerStripe } from "@/lib/stripe";

const PLAN_PRICES: Record<string, { name: string; monthly: number }> = {
  essential: { name: "Essential", monthly: 3499 },  // cents
  premium: { name: "Premium", monthly: 4999 },
  ultimate: { name: "Ultimate", monthly: 6499 },
};

const PROMO_PRICE = 1499; // $14.99 in cents

export async function POST(req: NextRequest) {
  try {
    const stripe = getServerStripe();
    const body = await req.json();

    const {
      plan,
      firstName,
      lastName,
      email,
      phone,
      vehicleType,
      make,
      model,
      color,
      plate,
      surcharge,
    } = body;

    // Validate
    if (!plan || !PLAN_PRICES[plan]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing customer info" }, { status: 400 });
    }

    const planData = PLAN_PRICES[plan];
    const monthlyAmount = planData.monthly + (surcharge ? surcharge * 100 : 0);

    // Create or find Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`,
      phone,
      metadata: {
        vehicleType,
        make,
        model,
        color,
        plate,
      },
    });

    // Create the recurring price
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: monthlyAmount,
      recurring: { interval: "month" },
      product_data: {
        name: `Majestic Car Wash — ${planData.name} Membership`,
        metadata: { plan },
      },
    });

    // Create a coupon for first-month promo ($14.99 first month)
    // This gives a discount equal to (monthly - $14.99) off the first invoice
    const discountAmount = monthlyAmount - PROMO_PRICE;
    let couponId: string | undefined;

    if (discountAmount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: discountAmount,
        currency: "usd",
        duration: "once",
        name: "First Month Promo — $14.99",
      });
      couponId = coupon.id;
    }

    // Create checkout session
    const sessionParams: any = {
      mode: "subscription",
      customer: customer.id,
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup?plan=${plan}`,
      subscription_data: {
        metadata: {
          plan,
          planName: planData.name,
          price: (monthlyAmount / 100).toFixed(2),
          firstName,
          lastName,
          email,
          phone,
          vehicleType,
          make,
          model,
          color,
          plate: plate.toUpperCase(),
          surcharge: String(surcharge || 0),
        },
      },
      metadata: {
        plan,
        firstName,
        lastName,
      },
    };

    if (couponId) {
      sessionParams.discounts = [{ coupon: couponId }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}