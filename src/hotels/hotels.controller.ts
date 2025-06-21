// src/hotels/hotels.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../users/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateHotelStatusDto } from './dto/update-hotel-status.dto';
import { CreateHotelRoomTypeDto } from './dto/create-hotel-room-type.dto';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get('public/featured')
  findFeatured() {
    return this.hotelsService.findFeatured();
  }

  @Get()
  findAllPublic() {
    return this.hotelsService.findAllPublic();
  }

  @Get(':id')
  findOnePublic(@Param('id', ParseIntPipe) id: number) {
    return this.hotelsService.findOnePublic(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  create(@Body() createHotelDto: CreateHotelDto, @GetUser() agent: User) {
    return this.hotelsService.create(createHotelDto, agent);
  }
  
  @Post(':hotelId/room-types')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  addRoomType(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @Body() createRoomTypeDto: CreateHotelRoomTypeDto,
    @GetUser() agent: User,
  ) {
    return this.hotelsService.addRoomType(hotelId, createRoomTypeDto, agent);
  }

  @Get('agent/my-hotels')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  findAllForAgent(@GetUser() agent: User) {
    return this.hotelsService.findAllForAgent(agent.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() agent: User,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    return this.hotelsService.update(id, agent.id, updateHotelDto);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllAdmin() {
    return this.hotelsService.findAllAdmin();
  }

  @Patch('admin/status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHotelStatusDto: UpdateHotelStatusDto,
  ) {
    return this.hotelsService.updateStatus(id, updateHotelStatusDto.status);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.hotelsService.remove(id, user);
  }
}
