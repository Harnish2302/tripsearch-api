// In src/payments/payments.controller.ts
import { Controller, Post, Body, UseGuards, RawBodyRequest, Req, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { Request } from 'express';


@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('order')
  @UseGuards(JwtAuthGuard)
  createOrder(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    return this.paymentsService.createOrder(createOrderDto.amount, user);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(
      verifyPaymentDto.razorpayOrderId,
      verifyPaymentDto.razorpayPaymentId,
      verifyPaymentDto.razorpaySignature,
    );
  }

  // This endpoint receives updates from Razorpay. It should NOT be protected by JWT.
  // It is secured by verifying the signature from Razorpay.
  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    const signature = req.headers['x-razorpay-signature'];

    if (typeof signature !== 'string') {
      throw new BadRequestException('Razorpay signature header is missing or invalid.');
    }

    const isVerified = this.paymentsService.verifyWebhookSignature(req.rawBody, signature);

    if (isVerified) {
        await this.paymentsService.handleWebhook(req.body);
    }
    // Always return 200 to Razorpay to acknowledge receipt, even if verification fails.
    return { status: 'ok' };
  }
}