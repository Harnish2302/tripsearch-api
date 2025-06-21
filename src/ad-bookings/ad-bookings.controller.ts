// src/ad-bookings/ad-bookings.controller.ts

import { Controller, Get, Post, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AdBookingsService } from './ad-bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../users/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreateAdBookingDto } from './dto/create-ad-booking.dto';

@Controller('ad-bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdBookingsController {
  constructor(private readonly adBookingsService: AdBookingsService) {}

  @Post()
  @Roles(UserRole.AGENT)
  create(@Body() createAdBookingDto: CreateAdBookingDto, @GetUser() agent: User) {
    return this.adBookingsService.create(createAdBookingDto, agent);
  }

  @Get('my-bookings')
  @Roles(UserRole.AGENT)
  findAllForAgent(@GetUser() agent: User) {
    return this.adBookingsService.findAllForAgent(agent);
  }

  @Get('admin/all')
  @Roles(UserRole.ADMIN)
  findAllForAdmin() {
    return this.adBookingsService.findAllForAdmin();
  }
}