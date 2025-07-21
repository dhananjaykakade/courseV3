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
  subject: '🎉 Payment Confirmation – Trinity Consultancy',
  html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
      <h2 style="color: #6366f1;">✅ Payment Successful</h2>
      <p>Hi there,</p>
      <p>Thank you for your payment! We're excited to have you onboard.</p>

      <h3 style="margin-top: 24px;">🧾 Payment Details:</h3>
      <table style="border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 12px;"><strong>Payment ID:</strong></td>
          <td style="padding: 6px 12px;">${paymentDetails.id}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px;"><strong>Amount:</strong></td>
          <td style="padding: 6px 12px;">₹${(paymentDetails.amount / 100).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px;"><strong>Status:</strong></td>
          <td style="padding: 6px 12px;">${paymentDetails.status}</td>
        </tr>
        ${
          paymentDetails.notes.course_title
            ? `<tr>
                <td style="padding: 6px 12px;"><strong>Course:</strong></td>
                <td style="padding: 6px 12px;">${paymentDetails.notes.course_title}</td>
              </tr>`
            : ''
        }
      </table>

      <p style="margin-top: 24px;">
        You'll soon receive access to your course materials. If you face any issues, feel free to reach out.
      </p>

      <p style="margin-top: 24px;">
        📧 <strong>Support:</strong> <a href="mailto:support@trinityconsultancy.in">support@trinityconsultancy.in</a>
      </p>

      <hr style="margin-top: 32px;" />
      <p style="font-size: 13px; color: #999;">
        Trinity Consultancy<br />
        Thank you for choosing us.
      </p>
    </div>
  `,
});

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
