import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// This enum must match the definition in your database
export enum DestinationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
}

@Entity({ name: 'destinations' })
export class Destination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  imageUrl: string;

  @Column({ type: 'text', nullable: true })
  imageUrls: string; // Storing as a JSON string is recommended

  @Column({ nullable: true })
  bestTimeToVisit: string;

  @Column({ type: 'text', nullable: true })
  highlights: string; // Storing as a JSON string is recommended

  @Column({ type: 'text', nullable: true })
  tags: string; // Storing as a JSON string is recommended

  @Column({ nullable: true })
  region: string;

  @Column({ nullable: true })
  idealDuration: string;

  @Column({ type: 'text', nullable: true })
  knownFor: string;

  @Column({ nullable: true })
  languages: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'int', default: 0 })
  popularity: number;

  @Column({
    type: 'enum',
    enum: DestinationStatus,
    default: DestinationStatus.DRAFT,
  })
  status: DestinationStatus;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
