import { NextResponse } from "next/server";
import { handleStripeWebhook } from "@/lib/services/billing";

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  try {
    // Read raw request body as text for verification
    const rawBody = await req.text();
    const result = await handleStripeWebhook(sig, rawBody);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[STRIPE WEBHOOK API] Processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
