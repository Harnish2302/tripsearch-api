// In src/quotes/quotes.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteRequestDto } from './dto/create-quote-request.dto';
import { CreateQuoteResponseDto } from './dto/create-quote-response.dto';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../users/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('quotes')
@UseGuards(JwtAuthGuard) // All routes in this controller require a logged-in user
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  // --- TRAVELER-ONLY ROUTES ---

  @Post('request')
  @Roles(UserRole.TRAVELER)
  @UseGuards(RolesGuard)
  createRequest(
    @Body() createDto: CreateQuoteRequestDto,
    @GetUser() traveler: User,
  ) {
    return this.quotesService.createRequest(createDto, traveler);
  }

  @Get('my-requests')
  @Roles(UserRole.TRAVELER)
  @UseGuards(RolesGuard)
  findMyRequests(@GetUser() traveler: User) {
    return this.quotesService.findAllForTraveler(traveler.id);
  }
  
  @Patch('request/:id/status')
  @Roles(UserRole.TRAVELER)
  @UseGuards(RolesGuard)
  updateRequestStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() traveler: User,
    @Body() updateStatusDto: UpdateQuoteStatusDto,
  ) {
    return this.quotesService.updateRequestStatus(id, traveler.id, updateStatusDto.status);
  }

  // --- AGENT-ONLY ROUTES ---

  @Post('request/:id/respond')
  @Roles(UserRole.AGENT)
  @UseGuards(RolesGuard)
  createResponse(
    @Param('id', ParseIntPipe) id: number,
    @Body() createDto: CreateQuoteResponseDto,
    @GetUser() agent: User,
  ) {
    return this.quotesService.createResponse(id, createDto, agent);
  }

  @Get('my-assigned')
  @Roles(UserRole.AGENT)
  @UseGuards(RolesGuard)
  findMyAssigned(@GetUser() agent: User) {
    return this.quotesService.findAllForAgent(agent.id);
  }
}