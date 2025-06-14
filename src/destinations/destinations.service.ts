import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destination } from './destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(
    @InjectRepository(Destination)
    private destinationsRepository: Repository<Destination>,
  ) {}

  findAll(): Promise<Destination[]> {
    return this.destinationsRepository.find();
  }

  async findOne(id: number): Promise<Destination> {
    const destination = await this.destinationsRepository.findOneBy({ id });
    if (!destination) {
      throw new NotFoundException(`Destination with ID #${id} not found`);
    }
    return destination;
  }

  create(createDestinationDto: CreateDestinationDto): Promise<Destination> {
    const destination = this.destinationsRepository.create(createDestinationDto);
    return this.destinationsRepository.save(destination);
  }

  async update(id: number, updateDestinationDto: UpdateDestinationDto): Promise<Destination> {
    const destination = await this.destinationsRepository.preload({
      id: id,
      ...updateDestinationDto,
    });
    if (!destination) {
      throw new NotFoundException(`Destination with ID #${id} not found`);
    }
    return this.destinationsRepository.save(destination);
  }

  async remove(id: number): Promise<void> {
    const destination = await this.findOne(id);
    await this.destinationsRepository.remove(destination);
  }
}