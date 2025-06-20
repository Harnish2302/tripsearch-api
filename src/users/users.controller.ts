// In src/users/users.controller.ts

import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './user.entity';

@Controller('users')
// Every route in this controller will require a valid JWT token.
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * This endpoint is for admins to get a list of all users.
   * It replaces the logic from get_all_users.php
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * This endpoint is for an admin to get a single user's profile.
   * It replaces the logic from get_user_profile.php
   */
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOneById(id);
  }
}