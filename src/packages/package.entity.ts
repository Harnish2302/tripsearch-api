import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PackageImage } from './package-image.entity';

@Entity({ name: 'packages' })
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'agentId' })
  agentId: number;

  @Column()
  title: string;

  // The 'slug' column has been removed to match the database schema.

  @Column({ nullable: true })
  destination: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'imageUrl', nullable: true })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  price: number;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ name: 'packageType', nullable: true })
  packageType: string;

  @Column({ type: 'text', nullable: true })
  inclusions: string;

  @Column({ type: 'text', nullable: true })
  exclusions: string;

  @Column({ type: 'longtext', nullable: true })
  itinerary: string;

  @Column({ name: 'maxParticipants', nullable: true })
  maxParticipants: number;

  @Column({ name: 'minAge', nullable: true })
  minAge: number;

  @Column({ name: 'discountPrice', type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPrice: number;

  @Column({ name: 'discountPercentage', type: 'decimal', precision: 5, scale: 2, nullable: true })
  discountPercentage: number;
  
  @Column({ default: 'pending_approval' })
  status: string;

  @Column({ name: 'rejectionReason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'tinyint', default: 0 })
  featured: boolean;

  @Column({ nullable: true })
  tags: string;

  @Column({ name: 'hotelCategory', default: 'Standard' })
  hotelCategory: string;

  @Column({ name: 'availability_dates', type: 'longtext', nullable: true })
  availabilityDates: string;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToMany(() => PackageImage, (image) => image.package, { cascade: true, eager: true })
  images: PackageImage[];
}