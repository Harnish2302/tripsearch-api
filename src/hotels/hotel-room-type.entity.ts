// In src/hotels/hotel-room-type.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity('hotel_room_types')
export class HotelRoomType {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Hotel, (hotel) => hotel.roomTypes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' }) // This creates an indexed `hotel_id` foreign key column
  hotel: Hotel;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  pricePerNight: number;

  @Column({ nullable: true })
  capacity: number;

  @Column({ nullable: true })
  beds: string; // e.g., "1 King, 2 Queen"

  @Column({ type: 'json', nullable: true })
  amenities: string[];

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}