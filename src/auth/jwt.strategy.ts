import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // Tell passport how to extract the token from the request header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // We do not want to allow expired tokens
      ignoreExpiration: false,
      // The secret used to sign the token, read from our .env file
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * This method is called by the JwtAuthGuard after a token has been
   * successfully verified. The payload is the decoded JSON from the token.
   * Whatever is returned from this method is attached to the Request object as `req.user`.
   */
  async validate(payload: any) {
    // We are returning the user's ID and email from the token's payload.
    // This will be available in any protected route handler as `req.user`.
    return { userId: payload.sub, email: payload.email };
  }
}
