import { Controller, Request, Post, UseGuards, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterTravelerDto } from './dto/register-traveler.dto';
import { RegisterAgentDto } from './dto/register-agent.dto';
import { LoginDto } from './dto/login.dto'; // This import might be needed if not present

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register/traveler')
  @HttpCode(HttpStatus.CREATED)
  registerTraveler(@Body() registerDto: RegisterTravelerDto) {
    return this.authService.registerTraveler(registerDto);
  }

  @Post('register/agent')
  @HttpCode(HttpStatus.CREATED)
  registerAgent(@Body() registerDto: RegisterAgentDto) {
    return this.authService.registerAgent(registerDto);
  }

  // 1. ADD THE GUARD to protect this endpoint
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    // 2. UPDATE THE RETURN VALUE
    // This decorator uses the JwtStrategy to verify the token.
    // If the token is valid, `req.user` is populated by the strategy.
    return req.user;
  }
}