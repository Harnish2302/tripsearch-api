import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole, UserStatus } from '../users/user.entity';
import { RegisterTravelerDto } from './dto/register-traveler.dto';
import { RegisterAgentDto } from './dto/register-agent.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // FIX: Calling the new public method instead of accessing a private repository
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
    // This now works because UsersService's create method expects Partial<User>
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
    // This also now works correctly
    return this.usersService.create(newUser);
  }
}