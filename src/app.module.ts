import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { DestinationsModule } from './destinations/destinations.module';
import { Destination } from './destinations/destination.entity';
import { PackagesModule } from './packages/packages.module';
import { Package } from './packages/package.entity';
import { PackageImage } from './packages/package-image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'srv1859.hstgr.io',
        port: 3306,
        username: 'u260883056_mt',
        // Reads the database password securely from the .env file
        password: configService.get<string>('DB_PASSWORD'),
        database: 'u260883056_mahaan_tours',
        entities: [User, Destination, Package, PackageImage],
        synchronize: false,
      }),
    }),
    
    UsersModule,
    AuthModule,
    DestinationsModule,
    PackagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
