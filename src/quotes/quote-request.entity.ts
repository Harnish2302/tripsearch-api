// In src/quotes/quote-request.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Destination } from '../destinations/destination.entity';
import { QuoteResponse } from './quote-response.entity';

export enum QuoteStatus {
  PENDING = 'pending',
  RESPONDED = 'responded',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

@Entity('quote_requests')
export class QuoteRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  traveler: User;
  
  // FIX: Change type to allow for null values
  @ManyToOne(() => User, { nullable: true })
  agent: User | null;

  @ManyToOne(() => Destination)
  destination: Destination;

  // ... rest of the file is correct
  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column()
  numberOfTravelers: number;

  @Column({ type: 'text' })
  additionalDetails: string;
  
  @Column({
    type: 'enum',
    enum: QuoteStatus,
    default: QuoteStatus.PENDING,
  })
  status: QuoteStatus;

  @OneToOne(() => QuoteResponse, response => response.request)
  response: QuoteResponse;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}