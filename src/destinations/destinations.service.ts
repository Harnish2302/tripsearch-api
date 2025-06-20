// In src/destinations/destinations.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination, DestinationStatus } from './destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private destinationsRepository: Repository<Destination>,
  ) {}

  // Creates a new destination - Replaces admin_add_destination.php
  async create(createDestinationDto: CreateDestinationDto): Promise<Destination> {
    const newDestination = this.destinationsRepository.create(createDestinationDto);
    return this.destinationsRepository.save(newDestination);
  }

  // Finds all active destinations for public view - Replaces get_all_destinations.php
  async findAllPublic(): Promise<Destination[]> {
    return this.destinationsRepository.find({
      where: { status: DestinationStatus.ACTIVE },
    });
  }

  // Finds all destinations for the admin view - Replaces get_all_destinations_admin.php
  async findAllAdmin(): Promise<Destination[]> {
    return this.destinationsRepository.find();
  }

  // Finds a single active destination by ID for public view - Replaces get_destination_details.php
  async findOnePublic(id: number): Promise<Destination> {
    const destination = await this.destinationsRepository.findOne({
      where: { id, status: DestinationStatus.ACTIVE },
    });
    if (!destination) {
      throw new NotFoundException(`Destination with ID #${id} not found or is not active.`);
    }
    return destination;
  }

  // Finds any single destination by ID for admin view - Replaces get_destination_details_admin.php
  async findOneAdmin(id: number): Promise<Destination> {
    const destination = await this.destinationsRepository.findOneBy({ id });
    if (!destination) {
      throw new NotFoundException(`Destination with ID #${id} not found.`);
    }
    return destination;
  }

  // Updates a destination - Replaces update_destination.php
  async update(
    id: number,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<Destination> {
    const destination = await this.destinationsRepository.preload({
      id: id,
      ...updateDestinationDto,
    });
    if (!destination) {
      throw new NotFoundException(`Destination with ID #${id} not found`);
    }
    return this.destinationsRepository.save(destination);
  }

  // Deletes a destination
  async remove(id: number): Promise<void> {
    const result = await this.destinationsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Destination with ID #${id} not found`);
    }
  }
}