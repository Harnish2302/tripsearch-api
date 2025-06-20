// In src/payments/dto/create-order.dto.ts
import { IsNumber, Min } from 'class-validator';
export class CreateOrderDto {
  @IsNumber()
  @Min(1)
  amount: number;
}