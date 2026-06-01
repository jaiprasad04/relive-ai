import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { createCheckoutSession } from "@/lib/services/billing";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const body = await req.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json({ error: "planId is required." }, { status: 400 });
    }

    const checkoutSession = await createCheckoutSession(
      session.user.id,
      planId,
      session.user.email
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("[CHECKOUT API] Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate checkout." },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
