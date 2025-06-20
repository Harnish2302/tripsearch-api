// In src/auth/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles from the @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If an endpoint has no @Roles() decorator, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the user object that was attached to the request by the JwtStrategy
    const { user } = context.switchToHttp().getRequest();

    // Check if the user's role is included in the list of required roles
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}