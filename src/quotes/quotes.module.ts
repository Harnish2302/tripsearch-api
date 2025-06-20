// In src/quotes/quotes.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.entity';
import { Destination } from '../destinations/destination.entity';
import { QuoteRequest } from './quote-request.entity';
import { QuoteResponse } from './quote-response.entity';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';
import { QuotesService } from './quotes.service';
import { MessagingService } from './messaging.service';
import { QuotesController } from './quotes.controller';
import { MessagingController } from './messaging.controller';

@Module({
  imports: [
    // This makes all repositories available to the services in this module
    TypeOrmModule.forFeature([
      QuoteRequest,
      QuoteResponse,
      Conversation,
      Message,
      User,
      Destination,
    ]),
    // We import AuthModule to make sure Passport and its guards are available
    AuthModule,
  ],
  controllers: [QuotesController, MessagingController],
  providers: [QuotesService, MessagingService],
})
export class QuotesModule {}