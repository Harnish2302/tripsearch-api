// src/hotels/hotel.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Destination } from '../destinations/destination.entity';
import { HotelImage } from './hotel-image.entity';
import { HotelRoomType } from './hotel-room-type.entity'; // <-- ADDED THIS

export enum HotelStatus {
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  INACTIVE = 'inactive',
}

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'agent_id' })
  agent: User;

  @ManyToOne(() => Destination)
  @JoinColumn({ name: 'destination_id' })
  destination: Destination;

  @OneToMany(() => HotelImage, (image) => image.hotel, {
    cascade: true,
    eager: true,
  })
  images: HotelImage[];

  // v-- ADDED THIS RELATIONSHIP --v
  @OneToMany(() => HotelRoomType, (roomType) => roomType.hotel, {
    cascade: true,
    eager: true, // Load room types automatically when fetching a hotel
  })
  roomTypes: HotelRoomType[];

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;
  
  @Column({ default: 'Hotel' })
  propertyType: string;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0.0 })
  starRating: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  pincode: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  website: string;
  
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerNight: number;

  @Column({ type: 'json', nullable: true })
  amenities: string[];

  @Column({ nullable: true })
  checkInTime: string;

  @Column({ nullable: true })
  checkOutTime: string;

  @Column({
    type: 'enum',
    enum: HotelStatus,
    default: HotelStatus.PENDING_APPROVAL,
  })
  status: HotelStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}