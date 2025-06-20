// In src/hotels/hotel-image.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// Update the path below if your hotel.entity.ts is in a different directory
import { Hotel } from './hotel.entity.js';

@Entity('hotel_images')
export class HotelImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  altText: string;

  // This creates the many-to-one relationship with the Hotel entity.
  @ManyToOne(() => Hotel, (hotel) => hotel.images, { onDelete: 'CASCADE' })
  hotel: Hotel;
}