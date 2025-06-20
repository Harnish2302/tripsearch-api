import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Your nested DTO for images is perfect and remains unchanged.
class CreatePackageImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  altText?: string;
  
  @IsNumber()
  @IsOptional()
  sortOrder?: number;
}

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  // We expect the ID of the destination, which we'll use to create the relation.
  @IsNumber()
  @IsNotEmpty()
  destinationId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;
  
  @IsNumber()
  @IsOptional()
  @Min(0)
  discountPrice?: number;
  
  @IsNumber()
  @Min(1)
  duration: number; // in days
  
  @IsString()
  @IsOptional()
  packageType?: string;

  @IsString()
  @IsOptional()
  hotelCategory?: string;

  // --- Array Fields ---
  // These now correctly validate an array of strings.
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  inclusions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  exclusions?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
  
  // --- Nested Objects ---
  // This validates an array of Itinerary objects.
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ItineraryDayDto) // We define this small helper class below
  itinerary?: ItineraryDayDto[];
  
  // This validates the array of images you already defined. It is perfect.
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePackageImageDto)
  images: CreatePackageImageDto[];
  
  // --- Optional Simple Fields ---
  @IsNumber()
  @IsOptional()
  maxParticipants?: number;

  @IsNumber()
  @IsOptional()
  minAge?: number;
  
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean; // Renamed from 'featured' for clarity
}

// A small helper class to validate the structure of each day in the itinerary.
class ItineraryDayDto {
    @IsNumber()
    @IsNotEmpty()
    day: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}