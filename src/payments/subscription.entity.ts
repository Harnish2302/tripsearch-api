// In src/payments/subscription.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum SubscriptionStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    CANCELLED = 'cancelled',
}

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    agent: User;

    @Column()
    razorpaySubscriptionId: string;

    @Column()
    razorpayPlanId: string;

    @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.INACTIVE })
    status: SubscriptionStatus;

    @Column({ type: 'timestamp' })
    currentPeriodEnd: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}