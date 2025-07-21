// /app/api/razorpay-webhook/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { emailService } from '@/lib/services/email';

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
    console.log('Payment captured:', paymentDetails);
    emailService.sendEmail({
        to: 'noreply.trinityconsultancy@gmail.com',
        subject: 'Payment Received',
        html: `
            <h1>Payment Received</h1>
            <p>Payment ID: ${paymentDetails.id}</p>
            <p>Amount: ₹${(paymentDetails.amount / 100).toFixed(2)}</p>
            <p>Status: ${paymentDetails.status}</p>
        `,
        }).catch(err => {
        console.error('Failed to send payment email:', err);
    })
  

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: false });
}
