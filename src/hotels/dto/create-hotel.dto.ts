// In src/hotels/dto/create-hotel.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  Min,
  Max,
  ValidateNested,
  IsUrl,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

// A small helper DTO for validating uploaded images
class CreateHotelImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  altText?: string;
}

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  destinationId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  pincode?: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  starRating?: number;
  
  @IsString()
  @IsOptional()
  propertyType?: string;
  
  @IsNumber()
  @IsOptional()
  @Min(0)
  pricePerNight?: number;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];
  
  @IsString()
  @IsOptional()
  checkInTime?: string;

  @IsString()
  @IsOptional()
  checkOutTime?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHotelImageDto)
  images: CreateHotelImageDto[];
}