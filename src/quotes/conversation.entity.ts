// In src/quotes/conversation.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../users/user.entity';
import { QuoteRequest } from './quote-request.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => QuoteRequest)
  @JoinColumn()
  quoteRequest: QuoteRequest;

  @ManyToOne(() => User)
  traveler: User;

  @ManyToOne(() => User)
  agent: User;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  @Column()
  subject: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}