// src/ad-bookings/ad-bookings.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AdBooking } from './ad-booking.entity';
import { AdBookingsService } from './ad-bookings.service';
import { AdBookingsController } from './ad-bookings.controller';
import { Package } from '../packages/package.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdBooking, Package, User]),
    AuthModule,
  ],
  controllers: [AdBookingsController],
  providers: [AdBookingsService],
})
export class AdBookingsModule {}