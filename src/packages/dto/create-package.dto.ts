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

  @IsNumber()
  @IsNotEmpty()
  agentId: number;

  // The 'slug' property has been removed to match the database schema.

  @IsString()
  @IsOptional()
  destination?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  duration?: number;
  
  @IsString()
  @IsOptional()
  packageType?: string;

  @IsString()
  @IsOptional()
  inclusions?: string;

  @IsString()
  @IsOptional()
  exclusions?: string;

  @IsString()
  @IsOptional()
  itinerary?: string;
  
  @IsNumber()
  @IsOptional()
  maxParticipants?: number;

  @IsNumber()
  @IsOptional()
  minAge?: number;

  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @IsNumber()
  @IsOptional()
  discountPercentage?: number;
  
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
  
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsString()
  @IsOptional()
  tags?: string;
  
  @IsString()
  @IsOptional()
  hotelCategory?: string;

  @IsString()
  @IsOptional()
  availabilityDates?: string;
  
  @IsNumber()
  @IsOptional()
  viewCount?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePackageImageDto)
  @IsOptional()
  images?: CreatePackageImageDto[];
}