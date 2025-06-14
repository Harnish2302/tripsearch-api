import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './package.entity';
import { PackageImage } from './package-image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, PackageImage])],
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}
