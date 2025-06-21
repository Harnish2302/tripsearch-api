// src/search-logs/search-log.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('search_logs')
export class SearchLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  // FIX: Added `| null` to match the database schema
  @Column({ length: 50, nullable: true })
  searchCategory: string | null;

  // FIX: Added `| null` to match the database schema
  @Column({ nullable: true })
  searchTerm: string | null;

  // FIX: Added `| null` to match the database schema
  @Column({ type: 'text', nullable: true })
  filters: string | null;

  @CreateDateColumn()
  searchTimestamp: Date;

  // FIX: Added `| null` to match the database schema
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  locationLat: number | null;

  // FIX: Added `| null` to match the database schema
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  locationLng: number | null;

  // FIX: Added `| null` to match the database schema
  @Column({ length: 45, nullable: true })
  ipAddress: string | null;

  // FIX: Added `| null` to match the database schema
  @Column({ type: 'text', nullable: true })
  userAgent: string | null;
}
