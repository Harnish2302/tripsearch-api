// In src/quotes/messaging.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';
import { QuoteRequest, QuoteStatus } from './quote-request.entity';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(QuoteRequest)
    private quoteRequestRepository: Repository<QuoteRequest>,
  ) {}

  // --- Start a new conversation from an accepted quote request ---
  async startConversationFromQuote(quoteRequestId: number, traveler: User): Promise<Conversation> {
    const quoteRequest = await this.quoteRequestRepository.findOne({
      where: { id: quoteRequestId, traveler: { id: traveler.id }, status: QuoteStatus.ACCEPTED },
      relations: ['traveler', 'agent', 'destination'],
    });

    if (!quoteRequest) {
      throw new NotFoundException(
        `Accepted quote request with ID #${quoteRequestId} not found for this user.`,
      );
    }
    
    if (!quoteRequest.agent) {
        throw new NotFoundException(`Quote request does not have an assigned agent.`);
    }

    // Check if a conversation for this quote already exists
    const existingConversation = await this.conversationRepository.findOneBy({ quoteRequest: { id: quoteRequestId } });
    if (existingConversation) {
        return existingConversation;
    }

    const newConversation = this.conversationRepository.create({
      quoteRequest: quoteRequest,
      traveler: quoteRequest.traveler,
      agent: quoteRequest.agent,
      subject: `Inquiry about ${quoteRequest.destination.name}`,
    });

    return this.conversationRepository.save(newConversation);
  }

  // --- Send a new message in an existing conversation ---
  async sendMessage(
    conversationId: number,
    content: string,
    sender: User,
  ): Promise<Message> {
    const conversation = await this.conversationRepository.findOne({
        where: { id: conversationId },
        relations: ['traveler', 'agent']
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID #${conversationId} not found.`);
    }

    // Security Check: Ensure the sender is a participant in the conversation
    if (conversation.traveler.id !== sender.id && conversation.agent.id !== sender.id) {
        throw new ForbiddenException('You are not a participant in this conversation.');
    }

    const newMessage = this.messageRepository.create({
      conversation: conversation,
      sender: sender,
      content: content,
    });
    
    // Update the conversation's updatedAt timestamp to bring it to the top of lists
    await this.conversationRepository.update(conversationId, { updatedAt: new Date() });

    return this.messageRepository.save(newMessage);
  }
  
  // --- Get all conversations for a user ---
  async getConversationsForUser(user: User): Promise<Conversation[]> {
    return this.conversationRepository.find({
        where: [
            { traveler: { id: user.id } },
            { agent: { id: user.id } },
        ],
        order: { updatedAt: 'DESC' },
        relations: ['traveler', 'agent']
    });
  }

  // --- Get all messages for a specific conversation ---
  async getMessagesForConversation(conversationId: number, user: User): Promise<Message[]> {
    const conversation = await this.conversationRepository.findOne({
        where: { id: conversationId },
        relations: ['traveler', 'agent']
    });

    if (!conversation) {
        throw new NotFoundException(`Conversation with ID #${conversationId} not found.`);
    }
    
    // Security Check: Ensure the user requesting messages is a participant
    if (conversation.traveler.id !== user.id && conversation.agent.id !== user.id) {
        throw new ForbiddenException('You are not a participant in this conversation.');
    }

    return this.messageRepository.find({
        where: { conversation: { id: conversationId } },
        relations: ['sender'],
        order: { createdAt: 'ASC' }
    });
  }
}