// In src/packages/package.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Destination } from '../destinations/destination.entity';
import { PackageImage } from './package-image.entity';

// This enum is based on the status from your create_package.php script
export enum PackageStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INACTIVE = 'inactive',
}

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  // --- Relationships ---
  @ManyToOne(() => User)
  @JoinColumn({ name: 'agent_id' })
  agent: User;

  @ManyToOne(() => Destination)
  @JoinColumn({ name: 'destination_id' })
  destination: Destination;

  // This one-to-many relationship now eagerly loads the images.
  @OneToMany(() => PackageImage, (image) => image.package, {
    cascade: true, // Automatically save new images when a package is saved
    eager: true, // Automatically load the images whenever a package is fetched
  })
  images: PackageImage[];

  // --- Core Details from your PHP script ---
  @Column()
  title: string;

  // ADDED: A unique slug for clean URLs, generated automatically from the title.
  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPrice: number;
  
  @Column({ type: 'int' })
  duration: number; // in days

  @Column({ default: 'Standard' })
  packageType: string;

  @Column({ default: 'Standard' })
  hotelCategory: string;

  // --- JSON fields for complex data ---
  @Column({ type: 'json', nullable: true })
  itinerary: any[]; // e.g., [{ day: 1, title: 'Arrival', description: '...' }]

  @Column({ type: 'json', nullable: true })
  inclusions: string[];

  @Column({ type: 'json', nullable: true })
  exclusions: string[];

  @Column({ type: 'json', nullable: true })
  tags: string[];
  
  // ADDED: This field was in your PHP script for date ranges
  @Column({ type: 'json', nullable: true })
  availabilityDates: any[]; // e.g., [{ startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' }]

  // --- Additional Details ---
  @Column({ nullable: true })
  maxParticipants: number;

  @Column({ nullable: true })
  minAge: number;

  // --- Status & Visibility ---
  @Column({
    type: 'enum',
    enum: PackageStatus,
    default: PackageStatus.PENDING_APPROVAL,
  })
  status: PackageStatus;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  // --- Timestamps ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // This hook automatically generates the slug before inserting a new package.
  @BeforeInsert()
  generateSlug() {
    this.slug = this.title
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
}