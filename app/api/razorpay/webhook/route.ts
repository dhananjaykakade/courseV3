import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay"
import crypto from "crypto";
import { supabase } from "@/lib/supabaseClient"; // adjust path
import { enrollUserInCourse } from "@/lib/services/supabase-database";

/**
 * Razorpay webhook handler
 * Subscribed events (configure in dashboard):
 *  - payment.captured
 *
 * Verifies the webhook signature, updates payment_orders table and ensures user enrollment.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") as string | undefined;

  if (!signature) {
    return NextResponse.json({ success: false, message: "Signature missing" }, { status: 400 });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET env var not set");
    return NextResponse.json({ success: false }, { status: 500 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.warn("Webhook signature mismatch");
    return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const eventType = event.event as string;

  if (eventType !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  try {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id as string;
    const paymentId = payment.id as string;
    const amount = payment.amount / 100; // in rupees

    // Fetch order row
    const { data: orderRows, error: orderErr } = await supabase
      .from("payment_orders")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    if (orderErr) throw orderErr;
    if (!orderRows) {
      console.error("Order not found for webhook", orderId);
      return NextResponse.json({ success: false }, { status: 404 });
    }

    const order = orderRows as any;

    if (order.status === "success") {
      return NextResponse.json({ success: true });
    }

    // Update payment_orders table
    const { error: updateErr } = await supabase
      .from("payment_orders")
      .update({ status: "success", payment_id: paymentId })
      .eq("order_id", orderId);

    if (updateErr) throw updateErr;

    // Enroll the user (idempotent)
    await enrollUserInCourse(order.user_id, order.course_id, {
      payment_id: paymentId,
      order_id: orderId,
      amount,
      from_webhook: true,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook processing error", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
