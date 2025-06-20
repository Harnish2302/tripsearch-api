// In src/auth/strategies/local.strategy.ts

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Here, we tell Passport to use the 'email' field from the request body as the username.
    super({ usernameField: 'email' });
  }

  /**
   * NestJS will automatically call this 'validate' method when you use the AuthGuard('local').
   * It takes the credentials from the request body (email and password)
   * and uses the AuthService to check if they are valid.
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user; // If successful, this user object is attached to the request as req.user
  }
}