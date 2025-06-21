// In src/hotels/dto/create-hotel-room-type.dto.ts

import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, Min } from 'class-validator';

export class CreateHotelRoomTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  pricePerNight?: number;

  @IsNumber()
  @IsOptional()
  capacity?: number;
  
  @IsString()
  @IsOptional()
  beds?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsString()
  @IsOptional()
  imageUrl?: string;
}