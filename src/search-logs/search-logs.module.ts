// src/search-logs/search-logs.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchLog } from './search-log.entity';
import { SearchLogsService } from './search-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([SearchLog])],
  providers: [SearchLogsService],
  exports: [SearchLogsService], // Export the service so other modules can use it
})
export class SearchLogsModule {}