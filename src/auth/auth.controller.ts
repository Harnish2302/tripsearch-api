import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common'; // <-- Import Get
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.login(user);
  }

  // --- NEW PROTECTED ENDPOINT ---
  // 1. This endpoint is protected by the 'jwt' guard.
  // 2. The guard will automatically handle token verification. If the token is invalid
  //    or missing, it will throw a 401 Unauthorized error.
  // 3. If the token is valid, the `JwtStrategy`'s `validate` method runs,
  //    and its return value is attached to the request object as `req.user`.
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    // req.user contains the payload we returned from JwtStrategy.validate()
    // { userId: payload.sub, email: payload.email }
    return req.user;
  }
}
