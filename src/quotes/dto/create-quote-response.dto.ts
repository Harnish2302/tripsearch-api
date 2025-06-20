// In src/quotes/dto/create-quote-response.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateQuoteResponseDto {
  // The quoteId and agentId will come from the URL and the logged-in user's token.

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDateString()
  @IsOptional()
  validUntil?: string;
}