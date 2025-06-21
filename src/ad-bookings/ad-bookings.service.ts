// src/ad-bookings/ad-bookings.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdBooking } from './ad-booking.entity';
import { CreateAdBookingDto } from './dto/create-ad-booking.dto';
import { User, UserRole } from '../users/user.entity';
import { Package } from '../packages/package.entity';

@Injectable()
export class AdBookingsService {
  constructor(
    @InjectRepository(AdBooking)
    private adBookingRepository: Repository<AdBooking>,
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
  ) {}

  async create(
    createDto: CreateAdBookingDto,
    agent: User,
  ): Promise<AdBooking> {
    const tourPackage = await this.packageRepository.findOne({
      where: { id: createDto.packageId, agent: { id: agent.id } },
    });

    if (!tourPackage) {
      throw new NotFoundException(
        `Package with ID #${createDto.packageId} not found for your account.`,
      );
    }

    const newBooking = this.adBookingRepository.create({
      ...createDto,
      agent: agent,
      package: tourPackage,
      weekStartDate: new Date(createDto.weekStartDate),
    });

    return this.adBookingRepository.save(newBooking);
  }

  async findAllForAgent(agent: User): Promise<AdBooking[]> {
    return this.adBookingRepository.find({
      where: { agent: { id: agent.id } },
      relations: ['package'],
      order: { bookingTimestamp: 'DESC' },
    });
  }

  async findAllForAdmin(): Promise<AdBooking[]> {
    return this.adBookingRepository.find({
        relations: ['package', 'agent'],
        order: { bookingTimestamp: 'DESC' },
    });
  }
}