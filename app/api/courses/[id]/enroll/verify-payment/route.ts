export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { supabaseDb } from "@/lib/services/supabase-database";
import { authenticateUser } from "@/lib/middleware/auth";
import { razorpay } from "@/lib/utils/razorpay";
import crypto from "crypto";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, error } = await authenticateUser(request);
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ success: false, message: "Missing payment details" }, { status: 400 });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
    }

    // Check if already enrolled
    const isAlreadyEnrolled = await supabaseDb.isUserEnrolled(user.id, params.id);
    if (isAlreadyEnrolled) {
      return NextResponse.json({ success: true, message: "Payment verified and enrolled in this course" });
    }

    // Mark user as enrolled in the course
    const enrollResult = await supabaseDb.enrollUserInCourse(user.id, params.id, {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      payment_verified: true,
    });

    if (!enrollResult.success) {
      return NextResponse.json({ success: false, message: enrollResult.message || "Failed to enroll" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Payment verified and enrollment successful" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
