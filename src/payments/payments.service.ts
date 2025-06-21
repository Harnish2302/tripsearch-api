// In src/payments/payments.service.ts
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  // --- ONE-TIME PAYMENTS ---

  async createOrder(amount: number, user: User): Promise<any> {
    const options = {
      amount: amount * 100, // Amount in the smallest currency unit (e.g., paise for INR)
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    };
    const order = await this.razorpay.orders.create(options);

    // Log the transaction in our database
    const paymentLog = this.paymentRepository.create({
      razorpayOrderId: order.id,
      user: user,
      amount: amount,
      currency: 'INR',
      status: PaymentStatus.CREATED,
    });
    await this.paymentRepository.save(paymentLog);

    return order;
  }

  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): Promise<boolean> {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (!keySecret) {
      throw new InternalServerErrorException('Razorpay key secret is not configured.');
    }
    
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');
    
    const isSignatureValid = expectedSignature === razorpaySignature;

    if (isSignatureValid) {
      // Update our payment log to 'successful'
      await this.paymentRepository.update(
        { razorpayOrderId },
        {
          razorpayPaymentId,
          status: PaymentStatus.SUCCESSFUL,
        },
      );
    } else {
        await this.paymentRepository.update(
          { razorpayOrderId },
          {
            razorpayPaymentId,
            status: PaymentStatus.FAILED,
          },
        );
    }
    
    return isSignatureValid;
  }

  // --- SUBSCRIPTIONS (Logic to be expanded) ---

  // Placeholder for creating subscription logic
  async createSubscription(planId: string, user: User): Promise<any> {
    // In a real app, you would first create a plan on Razorpay if it doesn't exist.
    // Then create a subscription for the user with that planId.
    // Example: return this.razorpay.subscriptions.create({ plan_id: planId, total_count: 12 });
    return { message: 'Subscription logic to be implemented.' };
  }
  
  // --- WEBHOOKS ---

  verifyWebhookSignature(body: any, signature: string): boolean {
    const keySecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');

    if (!keySecret) {
      throw new InternalServerErrorException('Razorpay webhook secret is not configured.');
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(JSON.stringify(body))
      .digest('hex');

    return expectedSignature === signature;
  }

  async handleWebhook(event: any) {
    // Logic to handle different Razorpay events, e.g., 'subscription.charged'
    // 'subscription.activated', 'payment.failed'
    const eventType = event.event;
    console.log(`Received Razorpay webhook event: ${eventType}`);
    // Example: if (eventType === 'subscription.charged') { ... update subscription in DB ... }
  }
}