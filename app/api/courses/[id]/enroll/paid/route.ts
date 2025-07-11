// integrate razor pay payment gateway to buy paid courses
export const dynamic = "force-dynamic";

import { type NextRequest, NextResponse } from "next/server";
import { supabaseDb } from "@/lib/services/supabase-database";
import { authenticateUser } from "@/lib/middleware/auth";
import { initiatePayment } from "@/lib/utils/razorpay"; // Ensure this path is correct

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { user, error } = await authenticateUser(request);
    if (error || !user) {
      return NextResponse.json({ success: false, message: error || "Authentication required" }, { status: 401 });
    }

    // Fetch course
    const course = await supabaseDb.getCourseById(params.id);
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    // Prevent double enrollment
    const isAlreadyEnrolled = await supabaseDb.isUserEnrolled(user.id, params.id);
    if (isAlreadyEnrolled) {
      return NextResponse.json({ success: false, message: "Already enrolled in this course" }, { status: 400 });
    }

    // 🔐 Initiate payment via Razorpay
    const paymentResult = await initiatePayment(user.id, params.id, course.price);

    if (!paymentResult.success) {
      return NextResponse.json({ success: false, message: paymentResult.message }, { status: 500 });
    }

    // ✅ Return order details to client to open Razorpay modal
    return NextResponse.json({
      success: true,
      message: "Payment initiated successfully",
      orderId: paymentResult.orderId,
      amount: paymentResult.amount,
      currency: paymentResult.currency,
      razorpayKeyId: paymentResult.razorpayKeyId,
    });
  } catch (error) {
    console.error("Error enrolling in paid course:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}