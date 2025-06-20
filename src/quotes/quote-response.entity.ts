import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { QuoteRequest } from './quote-request.entity';
import { User } from '../users/user.entity';

@Entity('quote_responses')
export class QuoteResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => QuoteRequest, (request) => request.response, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  request: QuoteRequest;

  @ManyToOne(() => User)
  agent: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'date', nullable: true })
  validUntil: Date;

  @CreateDateColumn()
  createdAt: Date;
}