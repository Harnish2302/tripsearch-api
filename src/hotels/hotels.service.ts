// src/hotels/hotels.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel, HotelStatus } from './hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { User, UserRole } from '../users/user.entity';
import { Destination } from '../destinations/destination.entity';
import { HotelImage } from './hotel-image.entity';
import { HotelRoomType } from './hotel-room-type.entity';
import { CreateHotelRoomTypeDto } from './dto/create-hotel-room-type.dto';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private hotelsRepository: Repository<Hotel>,
    @InjectRepository(Destination)
    private destinationsRepository: Repository<Destination>,
    @InjectRepository(HotelRoomType)
    private roomTypeRepository: Repository<HotelRoomType>,
  ) {}

  async create(createHotelDto: CreateHotelDto, agent: User): Promise<Hotel> {
    const destination = await this.destinationsRepository.findOneBy({
      id: createHotelDto.destinationId,
    });
    if (!destination) {
      throw new NotFoundException(
        `Destination with ID #${createHotelDto.destinationId} not found.`,
      );
    }
    const newHotel = new Hotel();
    Object.assign(newHotel, createHotelDto);
    newHotel.agent = agent;
    newHotel.destination = destination;
    newHotel.status = HotelStatus.PENDING_APPROVAL;
    newHotel.images = createHotelDto.images.map(imgDto => {
        const img = new HotelImage();
        img.imageUrl = imgDto.imageUrl;
        img.altText = imgDto.altText ?? '';
        return img;
    });
    return this.hotelsRepository.save(newHotel);
  }

  async findAllPublic(): Promise<Hotel[]> {
    return this.hotelsRepository.find({
      where: { status: HotelStatus.APPROVED },
      relations: ['destination'],
    });
  }

  async findFeatured(): Promise<Hotel[]> {
    return this.hotelsRepository.find({
      where: {
        status: HotelStatus.APPROVED,
        isFeatured: true,
      },
      relations: ['destination'],
      take: 3,
    });
  }

  async findOnePublic(id: number): Promise<Hotel> {
    const hotel = await this.hotelsRepository.findOne({
      where: { id, status: HotelStatus.APPROVED },
      relations: ['destination', 'agent'],
    });
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID #${id} not found or is not active.`);
    }
    return hotel;
  }

  async findAllForAgent(agentId: number): Promise<Hotel[]> {
    return this.hotelsRepository.find({
      where: { agent: { id: agentId } },
      relations: ['destination'],
    });
  }

  async update(hotelId: number, agentId: number, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    const hotel = await this.hotelsRepository.findOne({
      where: { id: hotelId, agent: { id: agentId } },
    });
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID #${hotelId} not found or you do not have permission to edit it.`);
    }
    Object.assign(hotel, updateHotelDto);
    hotel.status = HotelStatus.PENDING_APPROVAL;
    return this.hotelsRepository.save(hotel);
  }
  
  async addRoomType(hotelId: number, createRoomTypeDto: CreateHotelRoomTypeDto, agent: User): Promise<HotelRoomType> {
    const hotel = await this.hotelsRepository.findOne({
      where: { id: hotelId, agent: { id: agent.id } },
    });
    if (!hotel) {
      throw new NotFoundException(`Hotel with ID #${hotelId} not found or you do not have permission to modify it.`);
    }
    const newRoomType = this.roomTypeRepository.create({
      ...createRoomTypeDto,
      hotel: hotel,
    });
    return this.roomTypeRepository.save(newRoomType);
  }
  
  async findAllAdmin(): Promise<Hotel[]> {
    return this.hotelsRepository.find({ relations: ['agent', 'destination']});
  }
  
  async updateStatus(id: number, status: HotelStatus): Promise<Hotel> {
      const hotel = await this.hotelsRepository.findOneBy({ id });
      if(!hotel) {
          throw new NotFoundException(`Hotel with ID #${id} not found.`);
      }
      hotel.status = status;
      return this.hotelsRepository.save(hotel);
  }

  async remove(hotelId: number, user: User): Promise<void> {
    let hotel: Hotel | null = null;
    if (user.role === UserRole.ADMIN) {
        hotel = await this.hotelsRepository.findOneBy({ id: hotelId });
    } else if (user.role === UserRole.AGENT) {
        hotel = await this.hotelsRepository.findOne({ where: { id: hotelId, agent: { id: user.id } } });
    }
    if (!hotel) {
      throw new ForbiddenException(`Hotel with ID #${hotelId} not found or you do not have permission to delete it.`);
    }
    await this.hotelsRepository.remove(hotel);
  }
}
