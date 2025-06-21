// src/auth/auth.controller.ts

import { Controller, Request, Post, UseGuards, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterTravelerDto } from './dto/register-traveler.dto';
import { RegisterAgentDto } from './dto/register-agent.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto'; // <-- ADDED THIS
import { ResetPasswordDto } from './dto/reset-password.dto'; // <-- ADDED THIS

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
  
  // v-- ADDED forgot-password ENDPOINT --v
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  // v-- ADDED reset-password ENDPOINT --v
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}