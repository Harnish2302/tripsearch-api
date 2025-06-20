// In src/destinations/destinations.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destination } from './destination.entity';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';

@Module({
  imports: [
    // This makes the Destination entity's repository available to the DestinationsService
    TypeOrmModule.forFeature([Destination]),
  ],
  controllers: [DestinationsController],
  providers: [DestinationsService],
})
export class DestinationsModule {}