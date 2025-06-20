// In src/payments/payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export enum PaymentStatus {
  CREATED = 'created',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  razorpayOrderId: string;

  @Column({ nullable: true })
  razorpayPaymentId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.CREATED })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;
}