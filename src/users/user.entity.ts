import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// ADD 'export' HERE
export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  TRAVELER = 'traveler',
}

// AND ADD 'export' HERE
export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  firstName: string;

  @Column({ length: 100, nullable: true })
  lastName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ unique: true, length: 20, nullable: true })
  phone: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  // ... rest of your entity file is correct
  @Column({ nullable: true })
  photoUrl: string;

  @Column({ nullable: true })
  company: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  website: string;
  
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'json', nullable: true })
  specialties: string[];

  @Column({ type: 'json', nullable: true })
  languages: string[];

  @Column({ default: 'free' })
  subscriptionTier: string;

  @Column({ type: 'date', nullable: true })
  subscription_expires_at: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}