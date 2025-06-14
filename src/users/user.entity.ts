import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'firstName' }) // Corrected from 'name'
  firstName: string;

  @Column({ name: 'lastName' }) // Added this new property
  lastName: string;

  @Column()
  email: string;

  @Column({ name: 'passwordHash' }) // Corrected from 'password'
  passwordHash: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'company', nullable: true }) // Corrected from 'agencyName'
  company: string;

  @Column({ name: 'bio', type: 'text', nullable: true }) // Corrected from 'agencyDescription'
  bio: string;

  @Column({ name: 'website', nullable: true }) // Corrected from 'agencyWebsite'
  website: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ name: 'specialties', type: 'longtext', nullable: true })
  specialties: string;

  @Column({ name: 'languages', type: 'longtext', nullable: true })
  languages: string;

  @Column({ name: 'photoUrl', nullable: true }) // Corrected from 'profileImage'
  photoUrl: string;

  @Column()
  status: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createdAt: Date;

  // We are ignoring 'subscriptionTier' and 'subscription_expires_at' for now
}