import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import config from "@/lib/config";
import { addCredits } from "@/lib/services/user";
import { getGenerationCost } from "@/lib/services/ai";

export async function POST(req) {
  try {
    const payload = await req.json();
    console.log(`[MUAPI WEBHOOK] Received webhook payload:`, payload);

    const { id, status, outputs, error } = payload;

    if (!id) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    // Find creation
    const creation = await prisma.reliveCreation.findUnique({
      where: { requestId: id },
    });

    if (!creation) {
      console.warn(`[MUAPI WEBHOOK] Creation not found for requestId: ${id}`);
      return NextResponse.json({ received: true, warning: "RequestId not found" });
    }

    // If already processed, ignore (idempotent)
    if (creation.status !== "processing") {
      console.log(`[MUAPI WEBHOOK] Creation ${id} is already processed. Current status: ${creation.status}`);
      return NextResponse.json({ received: true, status: "already_processed" });
    }

    if (status === "completed") {
      const videoUrl = outputs?.[0] || payload.outputs?.[0] || payload.video?.url;
      if (!videoUrl) {
        console.error(`[MUAPI WEBHOOK] Webhook marked completed but no video URL found.`, payload);
        return NextResponse.json({ error: "No video url found in completed payload" }, { status: 400 });
      }

      await prisma.reliveCreation.update({
        where: { requestId: id },
        data: {
          status: "completed",
          videoFiles: {
            set: [videoUrl],
          },
        },
      });

      console.log(`[MUAPI WEBHOOK] Creation ${id} successfully updated to completed.`);
    } else if (status === "failed") {
      // Refund credits dynamically
      const refundAmount = getGenerationCost(creation.modelVariant, {
        duration: creation.duration,
        resolution: creation.resolution,
      });

      console.log(`[MUAPI WEBHOOK] Creation ${id} failed. Refunding ${refundAmount} credits to user ${creation.userId}.`);
      await addCredits(creation.userId, refundAmount);

      await prisma.reliveCreation.update({
        where: { requestId: id },
        data: {
          status: "failed",
          error: error || "Generation failed in AI pipeline (webhook).",
        },
      });
    } else {
      console.warn(`[MUAPI WEBHOOK] Unknown status in webhook payload: ${status}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[MUAPI WEBHOOK] Error processing webhook:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
