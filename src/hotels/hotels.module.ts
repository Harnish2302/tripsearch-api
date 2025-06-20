// In src/hotels/hotels.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './hotel.entity';
import { HotelImage } from './hotel-image.entity';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { Destination } from '../destinations/destination.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // This makes the repositories for Hotel, HotelImage, and Destination available to the HotelsService
    TypeOrmModule.forFeature([Hotel, HotelImage, Destination]),
    // We import AuthModule to make sure Passport and its guards are available
    AuthModule,
  ],
  controllers: [HotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}