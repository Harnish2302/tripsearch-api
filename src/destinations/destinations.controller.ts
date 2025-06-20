// In src/destinations/destinations.controller.ts

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
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
// FIX 1: Corrected the file path for JwtAuthGuard
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  // --- ADMIN ROUTES ---

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationsService.create(createDestinationDto);
  }

  // FIX 2: Corrected the typo from 'JwtAuthGaurd' to 'JwtAuthGuard'
  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllAdmin() {
    return this.destinationsService.findAllAdmin();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOneAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.destinationsService.findOneAdmin(id);
  }
  
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ) {
    return this.destinationsService.update(id, updateDestinationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.destinationsService.remove(id);
  }

  // --- PUBLIC ROUTES ---

  @Get()
  findAllPublic() {
    return this.destinationsService.findAllPublic();
  }

  @Get(':id')
  findOnePublic(@Param('id', ParseIntPipe) id: number) {
    return this.destinationsService.findOnePublic(id);
  }
}