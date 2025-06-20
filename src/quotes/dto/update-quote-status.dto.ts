// In src/quotes/dto/update-quote-status.dto.ts

import { IsEnum, IsNotEmpty } from 'class-validator';
import { QuoteStatus } from '../quote-request.entity';

export class UpdateQuoteStatusDto {
  @IsEnum(QuoteStatus)
  @IsNotEmpty()
  status: QuoteStatus;
}