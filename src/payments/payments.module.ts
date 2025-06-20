// In src/payments/payments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './payment.entity';
import { Subscription } from './subscription.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Payment, Subscription]),
    AuthModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}