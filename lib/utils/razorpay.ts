// NOTE: This utility file is used by both the **server** (to create orders) and the **browser**
// (to lazily load the Razorpay checkout script). Importing the Node-only `razorpay` package in
// the browser bundle throws an error. We therefore initialise the Razorpay SDK **only on the
// server**, using a dynamic `require` guarded by a runtime check.
/* eslint-disable @typescript-eslint/no-var-requires */

let razorpay: any;

if (typeof window === "undefined") {
  // We are on the server – safely require the Node SDK
  const Razorpay = require("razorpay");
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}


export { razorpay };

export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);

    if (document.getElementById("razorpay-sdk")) return resolve(true);

    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};



  // create a secure initiatePayment method from razorpay payment gateway
 export async function initiatePayment(
  userId: string,
  courseId: string,
  amountInRupees: number
): Promise<{
  success: boolean;
  message?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  razorpayKeyId?: string;
}> {
  try {
    console.log("Initiating payment for user:", userId, "for course:", courseId);

    // Create a unique receipt ID (can be saved to DB for tracking) it should be unique for each transaction and less than 40 characters
    const receiptId = `receipt_${userId}_${courseId}_${Date.now()}`.slice(0, 40);  // Ensure receipt ID is unique and less than 40 characters
    // make recipt id less than 40 characters


    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInRupees * 100, // amount in paisa
      currency: 'INR',
      receipt: receiptId,
      payment_capture: true, // Auto-capture payment after success
    });

    return {
      success: true,
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    };
  } catch (error: any) {
    console.error("Error initiating payment:", error);
    const msg = error?.error?.description || error?.message || "Failed to initiate payment";
    return {
      success: false,
      message: msg,
    };
  }
}
