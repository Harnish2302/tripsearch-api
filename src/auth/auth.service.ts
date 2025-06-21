// src/auth/auth.service.ts

import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserRole, UserStatus } from '../users/user.entity';
import { RegisterTravelerDto } from './dto/register-traveler.dto';
import { RegisterAgentDto } from './dto/register-agent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordReset } from './password-reset.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const userWithPassword = await this.usersService.findUserWithPassword(email);

    if (userWithPassword && (await bcrypt.compare(pass, userWithPassword.passwordHash))) {
      const { passwordHash, ...result } = userWithPassword;
      return result;
    }
    return null;
  }
  
  async login(user: any) {
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Your account is not active. Please contact support.');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerTraveler(registerDto: RegisterTravelerDto): Promise<User> {
    if (await this.usersService.findOneByEmail(registerDto.email)) {
      throw new ConflictException('Email address already registered.');
    }
    if (await this.usersService.findOneByPhone(registerDto.phone)) {
      throw new ConflictException('Phone number already registered.');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const newUser: Partial<User> = {
      ...registerDto,
      passwordHash,
      role: UserRole.TRAVELER,
      status: UserStatus.ACTIVE,
    };
    return this.usersService.create(newUser);
  }

  async registerAgent(registerDto: RegisterAgentDto): Promise<User> {
    if (await this.usersService.findOneByEmail(registerDto.email)) {
      throw new ConflictException('Email address already registered.');
    }
    if (await this.usersService.findOneByPhone(registerDto.phone)) {
      throw new ConflictException('Phone number already registered.');
    }
    
    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const nameParts = registerDto.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    const newUser: Partial<User> = {
      firstName,
      lastName,
      email: registerDto.email,
      phone: registerDto.phone,
      company: registerDto.agencyName,
      passwordHash,
      role: UserRole.AGENT,
      status: UserStatus.PENDING,
    };
    return this.usersService.create(newUser);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return { message: 'If a user with that email exists, a password reset link has been sent.' };
    }

    await this.passwordResetRepository.delete({ email: user.email });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    const passwordReset = this.passwordResetRepository.create({
      email: user.email,
      token,
      expiresAt,
    });
    await this.passwordResetRepository.save(passwordReset);

    console.log(`Password reset token for ${email}: ${token}`); 

    return { message: 'If a user with that email exists, a password reset link has been sent.' };
  }

  async resetPassword(resetDto: ResetPasswordDto): Promise<{ message: string }> {
    const passwordReset = await this.passwordResetRepository.findOneBy({ token: resetDto.token });

    if (!passwordReset || passwordReset.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }

    const user = await this.usersService.findOneByEmail(passwordReset.email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    user.passwordHash = await bcrypt.hash(resetDto.password, 10);
    await this.usersService.create(user);

    await this.passwordResetRepository.delete({ id: passwordReset.id });

    return { message: 'Password has been successfully reset.' };
  }
}
