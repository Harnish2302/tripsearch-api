// In src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validates a user's password.
   * @param email The user's email.
   * @param pass The user's plaintext password.
   * @returns The user object without the password hash if valid, otherwise null.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // Important: remove the password hash from the object returned to the caller
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Creates a JWT access token for a given user.
   * @param user The user object (must contain id, email, role).
   * @returns An object containing the signed JWT access token.
   */
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // We will implement the register method in a later step.
}