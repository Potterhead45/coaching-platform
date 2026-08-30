import { NextResponse } from 'next/server';
import { verifyRazorpayWebhookSignature, recordSuccessfulPayment } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    // If webhook secret is set, strictly verify HMAC signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.warn('Webhook signature mismatch in Razorpay webhook');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const event = payload.event;
    console.log(`Received Razorpay webhook event: ${event}`);

    // Process payment captured or order paid events
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;

      const orderId = paymentEntity?.order_id || orderEntity?.id;
      const paymentId = paymentEntity?.id;
      const amount = (paymentEntity?.amount || orderEntity?.amount || 0) / 100;
      const notes = paymentEntity?.notes || orderEntity?.notes || {};

      const userId = notes.userId;
      const mockTestId = notes.mockTestId || null;
      const courseId = notes.courseId || null;

      if (userId && orderId && paymentId) {
        await recordSuccessfulPayment({
          userId,
          mockTestId,
          courseId,
          amount,
          currency: paymentEntity?.currency || 'INR',
          gateway: 'RAZORPAY_WEBHOOK',
          orderId,
          paymentId,
        });
      }
    }

    return NextResponse.json({ status: 'ok', received: true });
  } catch (error: any) {
    console.error('Razorpay webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
