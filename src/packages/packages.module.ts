// In src/packages/packages.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './package.entity';
import { PackageImage } from './package-image.entity';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { Destination } from '../destinations/destination.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // This makes the repositories for Package, PackageImage, and Destination available to the PackagesService
    TypeOrmModule.forFeature([Package, PackageImage, Destination]),
    // We import AuthModule to make sure Passport and its guards are available
    AuthModule,
  ],
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}