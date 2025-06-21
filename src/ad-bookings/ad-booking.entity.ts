// src/ad-bookings/ad-booking.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Package } from '../packages/package.entity';

export enum AdPaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum AdBookingStatus {
  PENDING_APPROVAL = 'pending_approval',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REJECTED = 'rejected',
}

@Entity('ad_bookings')
export class AdBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'agent_id' })
  agent: User;

  @ManyToOne(() => Package)
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column()
  slotId: number;

  @Column({ nullable: true })
  slotName: string;

  @Column({ type: 'date' })
  weekStartDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amountPaid: number;

  @Column({ length: 3, default: 'INR' })
  currency: string;

  @Column({ nullable: true })
  razorpayOrderId: string;

  @Column({ nullable: true })
  razorpayPaymentId: string;

  @Column({ nullable: true })
  razorpaySignature: string;

  @Column({
    type: 'enum',
    enum: AdPaymentStatus,
    default: AdPaymentStatus.PENDING,
  })
  paymentStatus: AdPaymentStatus;

  @Column({
    type: 'enum',
    enum: AdBookingStatus,
    default: AdBookingStatus.PENDING_APPROVAL,
  })
  status: AdBookingStatus;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn()
  bookingTimestamp: Date;

  @Column({ type: 'timestamp', nullable: true })
  paymentTimestamp: Date;
}