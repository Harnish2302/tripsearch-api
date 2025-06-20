// In src/quotes/dto/create-quote-request.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

export class CreateQuoteRequestDto {
  // The travelerId will be taken from the logged-in user's token, not the body.

  @IsNumber()
  @IsNotEmpty()
  destinationId: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNumber()
  @Min(1)
  numberOfTravelers: number;

  @IsString()
  @IsNotEmpty()
  additionalDetails: string;

  // agentId is optional, for when a traveler wants to request from a specific agent.
  @IsNumber()
  @IsOptional()
  agentId?: number;
}