// In src/hotels/dto/update-hotel-status.dto.ts

import { IsEnum, IsNotEmpty } from 'class-validator';
import { HotelStatus } from '../hotel.entity';

export class UpdateHotelStatusDto {
  @IsEnum(HotelStatus)
  @IsNotEmpty()
  status: HotelStatus;
}