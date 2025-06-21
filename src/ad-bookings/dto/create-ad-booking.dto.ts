// src/ad-bookings/dto/create-ad-booking.dto.ts

import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAdBookingDto {
  @IsNumber()
  @IsNotEmpty()
  packageId: number;

  @IsNumber()
  @IsNotEmpty()
  slotId: number;

  @IsString()
  @IsNotEmpty()
  slotName: string;

  @IsDateString()
  @IsNotEmpty()
  weekStartDate: string;

  @IsNumber()
  @IsNotEmpty()
  amountPaid: number;
}