// In src/quotes/messaging.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messaging')
@UseGuards(JwtAuthGuard) // All routes in this controller require a logged-in user
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  // --- Start a new conversation from an accepted quote ---
  @Post('conversation/from-quote/:quoteId')
  startConversationFromQuote(
    @Param('quoteId', ParseIntPipe) quoteId: number,
    @GetUser() user: User,
  ) {
    return this.messagingService.startConversationFromQuote(quoteId, user);
  }

  // --- Get all of the current user's conversations ---
  @Get('conversations')
  getConversations(@GetUser() user: User) {
    return this.messagingService.getConversationsForUser(user);
  }

  // --- Get all messages for a specific conversation ---
  @Get('conversation/:id/messages')
  getMessages(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.messagingService.getMessagesForConversation(id, user);
  }

  // --- Send a new message in a conversation ---
  @Post('conversation/:id/messages')
  sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() createMessageDto: CreateMessageDto,
    @GetUser() user: User,
  ) {
    return this.messagingService.sendMessage(id, createMessageDto.content, user);
  }
}