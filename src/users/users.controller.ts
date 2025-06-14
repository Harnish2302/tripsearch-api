import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // This means all routes in this file will start with /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // This creates a GET route at the base URL, so it will be /users
  findAll() {
    return this.usersService.findAll();
  }
}