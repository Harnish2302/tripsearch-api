// In src/packages/packages.controller.ts

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
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../users/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  // --- PUBLIC ROUTES ---

  @Get()
  findAllPublic() {
    return this.packagesService.findAllPublic();
  }

  @Get(':id')
  findOnePublic(@Param('id', ParseIntPipe) id: number) {
    return this.packagesService.findOnePublic(id);
  }

  // --- AGENT-ONLY ROUTES ---

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  create(@Body() createPackageDto: CreatePackageDto, @GetUser() agent: User) {
    return this.packagesService.create(createPackageDto, agent);
  }

  @Get('agent/my-packages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  findAllForAgent(@GetUser() agent: User) {
    return this.packagesService.findAllForAgent(agent.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AGENT)
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() agent: User,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.packagesService.update(id, agent.id, updatePackageDto);
  }

  // --- ADMIN-ONLY ROUTES ---

  @Get('admin/pending-approval')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllPending() {
    return this.packagesService.findAllPending();
  }

  @Patch('admin/status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackageStatusDto: UpdatePackageStatusDto,
  ) {
    return this.packagesService.updateStatus(id, updatePackageStatusDto.status);
  }
  
  // --- SECURED DELETE (AGENT or ADMIN) ---

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Only requires login, service handles role logic
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.packagesService.remove(id, user);
  }
}