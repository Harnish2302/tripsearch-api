import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { DestinationStatus } from '../destination.entity';

export class CreateDestinationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  imageUrls?: string;

  @IsString()
  @IsOptional()
  bestTimeToVisit?: string;

  @IsString()
  @IsOptional()
  highlights?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  idealDuration?: string;

  @IsString()
  @IsOptional()
  knownFor?: string;

  @IsString()
  @IsOptional()
  languages?: string;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  popularity?: number;

  @IsEnum(DestinationStatus)
  @IsOptional()
  status?: DestinationStatus;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  metaKeywords?: string;
}