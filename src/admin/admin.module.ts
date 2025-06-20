// In src/admin/admin.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../users/user.entity';
import { Package } from '../packages/package.entity';
import { Hotel } from '../hotels/hotel.entity';
import { Destination } from '../destinations/destination.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User, Package, Hotel, Destination]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
