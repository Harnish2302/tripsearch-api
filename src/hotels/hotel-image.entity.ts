// In src/hotels/hotel-image.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Hotel } from './hotel.entity';

@Entity('hotel_images')
export class HotelImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  altText: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.images, { onDelete: 'CASCADE' })
  hotel: Hotel;
}
