import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  // --- PROTECTED ROUTE ---
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationsService.create(createDestinationDto);
  }

  // --- PUBLIC ROUTE ---
  @Get()
  findAll() {
    return this.destinationsService.findAll();
  }

  // --- PUBLIC ROUTE ---
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.destinationsService.findOne(+id);
  }

  // --- PROTECTED ROUTE ---
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDestinationDto: UpdateDestinationDto) {
    return this.destinationsService.update(+id, updateDestinationDto);
  }

  // --- PROTECTED ROUTE ---
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.destinationsService.remove(+id);
  }
}