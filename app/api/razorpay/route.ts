// /app/api/razorpay-webhook/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { emailService } from '@/lib/services/email';
import { supabaseDb } from '@/lib/services/supabase-database';

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === 'payment.captured') {
    const paymentDetails = event.payload.payment.entity;
    const sent = await emailService.sendEmail({
        to: paymentDetails.notes.user_email || 'noreply.trinityconsultancy@gmail.com',
        subject: 'Payment Received',
        html: `
            <h1>Payment Received</h1>
            <p>Payment ID: ${paymentDetails.id}</p>
            <p>Amount: ₹${(paymentDetails.amount / 100).toFixed(2)}</p>
            <p>Status: ${paymentDetails.status}</p>
        `,
        })
    if (!sent) {
      return NextResponse.json({ success: false, message: 'Failed to send notification email' }, { status: 500})
    }
    // save the payment details to your database or perform any other necessary actions here
   const isAlreadyEnrolled = await supabaseDb.isUserEnrolled(paymentDetails.notes.user_id, paymentDetails.notes.course_id);
    if (isAlreadyEnrolled) {
      console.log('User is already enrolled in the course');
      return NextResponse.json({ success: true, message: 'User already enrolled' });
    }
    const enrollResult = await supabaseDb.enrollUserInCourse(paymentDetails.notes.user_id, paymentDetails.notes.course_id, {
      payment_id: paymentDetails.id,
      order_id: paymentDetails.order_id,
      payment_verified: true,
    });
    if (!enrollResult.success) {
      return NextResponse.json({ success: false, message: 'Failed to enroll user in course' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'Payment processed and user enrolled' });
  }

  return NextResponse.json({ received: false });
}
