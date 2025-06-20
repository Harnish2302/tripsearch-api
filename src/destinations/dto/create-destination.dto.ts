import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { DestinationStatus } from '../destination.entity';

export class CreateDestinationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  region?: string;

  // We will handle the file path logic in the service/controller,
  // the DTO just expects a string URL path.
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];

  @IsString()
  @IsOptional()
  bestTimeToVisit?: string;

  @IsString()
  @IsOptional()
  idealDuration?: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  popularity?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  highlights?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  knownFor?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @IsEnum(DestinationStatus)
  @IsOptional()
  status?: DestinationStatus;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  metaKeywords?: string[];
}