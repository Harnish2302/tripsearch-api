// src/search-logs/search-logs.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchLog } from './search-log.entity';
import { User } from '../users/user.entity';

// This DTO defines the data we can log.
export class LogSearchDto {
  user?: User;
  searchCategory?: string; // Made optional to match the entity's nullable status
  searchTerm?: string;
  filters?: object;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class SearchLogsService {
  constructor(
    @InjectRepository(SearchLog)
    private searchLogRepository: Repository<SearchLog>,
  ) {}

  async create(logData: LogSearchDto): Promise<void> {
    // FIX: Create a plain partial object and pass it directly to the save method.
    // This avoids any type mismatches when instantiating the class directly
    // with properties that might be undefined from the DTO.
    const logToSave: Partial<SearchLog> = {
      user: logData.user,
      searchCategory: logData.searchCategory,
      searchTerm: logData.searchTerm,
      filters: logData.filters ? JSON.stringify(logData.filters) : null,
      ipAddress: logData.ipAddress,
      userAgent: logData.userAgent,
    };

    // The `save` method can handle partial objects and correctly insert them,
    // managing undefined vs. null conversions appropriately.
    await this.searchLogRepository.save(logToSave);
  }
}
