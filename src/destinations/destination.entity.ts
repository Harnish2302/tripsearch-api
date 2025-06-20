// In src/destinations/destination.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

// We can define the possible statuses as an enum for type safety.
// This is based on the status check in your PHP file.
export enum DestinationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
}

@Entity('destinations')
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  region: string;

  // Corresponds to 'primaryImage' in the old script
  @Column()
  imageUrl: string;

  // Corresponds to 'galleryImages'
  @Column({ type: 'json', nullable: true })
  imageUrls: string[];

  @Column({ nullable: true })
  bestTimeToVisit: string;

  @Column({ nullable: true })
  idealDuration: string;

  @Column()
  currency: string;

  @Column({ type: 'int', default: 0 })
  popularity: number;

  @Column({ type: 'json', nullable: true })
  highlights: string[];

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  knownFor: string[];

  @Column({ type: 'json', nullable: true })
  languages: string[];

  @Column({
    type: 'enum',
    enum: DestinationStatus,
    default: DestinationStatus.DRAFT,
  })
  status: DestinationStatus;

  // Meta fields for SEO
  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'json', nullable: true })
  metaKeywords: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // This hook automatically generates a URL-friendly slug from the name
  // before a new destination is inserted into the database. This replaces
  // the 'generateSlug' function in your PHP file.
  @BeforeInsert()
  generateSlug() {
    this.slug = this.name
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }
}