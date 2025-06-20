// In src/quotes/quotes.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuoteRequest, QuoteStatus } from './quote-request.entity';
import { QuoteResponse } from './quote-response.entity';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { CreateQuoteResponseDto } from './dto/create-quote-response.dto';
import { User, UserRole } from '../users/user.entity';
import { Destination } from '../destinations/destination.entity';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(QuoteRequest)
    private quoteRequestRepository: Repository<QuoteRequest>,
    @InjectRepository(QuoteResponse)
    private quoteResponseRepository: Repository<QuoteResponse>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Destination)
    private destinationRepository: Repository<Destination>,
  ) {}

  async createRequest(
    createDto: CreateQuoteRequestDto,
    traveler: User,
  ): Promise<QuoteRequest> {
    const destination = await this.destinationRepository.findOneBy({
      id: createDto.destinationId,
    });
    if (!destination) {
      throw new NotFoundException(`Destination with ID #${createDto.destinationId} not found.`);
    }

    let agent: User | null = null;
    if (createDto.agentId) {
      agent = await this.userRepository.findOne({
        where: { id: createDto.agentId, role: UserRole.AGENT },
      });
      if (!agent) {
        throw new NotFoundException(`Agent with ID #${createDto.agentId} not found.`);
      }
    }

    // FIX: Manually create the new entity to ensure type safety.
    const newRequest = new QuoteRequest();
    newRequest.traveler = traveler;
    newRequest.destination = destination;
    newRequest.agent = agent;
    newRequest.startDate = new Date(createDto.startDate);
    newRequest.endDate = new Date(createDto.endDate);
    newRequest.numberOfTravelers = createDto.numberOfTravelers;
    newRequest.additionalDetails = createDto.additionalDetails;
    
    return this.quoteRequestRepository.save(newRequest);
  }
  
  async createResponse(
    quoteRequestId: number,
    createDto: CreateQuoteResponseDto,
    agent: User,
  ): Promise<QuoteResponse> {
    const request = await this.quoteRequestRepository.findOne({
        where: { id: quoteRequestId },
        relations: ['agent']
    });

    if (!request) {
      throw new NotFoundException(`Quote Request with ID #${quoteRequestId} not found.`);
    }
    
    if (request.agent && request.agent.id !== agent.id) {
        throw new ForbiddenException('You are not assigned to this quote request.');
    }

    // FIX: Manually create the new entity to ensure type safety.
    const newResponse = new QuoteResponse();
    newResponse.request = request;
    newResponse.agent = agent;
    newResponse.price = createDto.price;
    newResponse.message = createDto.message;
    if (createDto.validUntil) {
      newResponse.validUntil = new Date(createDto.validUntil);
    }
    
    request.status = QuoteStatus.RESPONDED;
    if (!request.agent) {
        request.agent = agent;
    }
    await this.quoteRequestRepository.save(request);

    return this.quoteResponseRepository.save(newResponse);
  }

  // FIX: Ensure correct return type Promise<QuoteRequest[]>
  async findAllForTraveler(travelerId: number): Promise<QuoteRequest[]> {
    return this.quoteRequestRepository.find({
        where: { traveler: { id: travelerId } },
        relations: ['destination', 'agent', 'response'],
        order: { createdAt: 'DESC' }
    });
  }

  // FIX: Ensure correct return type Promise<QuoteRequest[]>
  async findAllForAgent(agentId: number): Promise<QuoteRequest[]> {
    return this.quoteRequestRepository.find({
        where: { agent: { id: agentId } },
        relations: ['destination', 'traveler', 'response'],
        order: { createdAt: 'DESC' }
    });
  }
  
  async updateRequestStatus(
    quoteRequestId: number, 
    travelerId: number, 
    status: QuoteStatus
  ): Promise<QuoteRequest> {
    const request = await this.quoteRequestRepository.findOne({
        where: { id: quoteRequestId, traveler: { id: travelerId } }
    });

    if (!request) {
        throw new NotFoundException(`Quote Request with ID #${quoteRequestId} not found or you do not have permission to modify it.`);
    }

    request.status = status;
    return this.quoteRequestRepository.save(request);
  }
}