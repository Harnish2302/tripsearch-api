// In src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DestinationsModule } from './destinations/destinations.module';
import { PackagesModule } from './packages/packages.module';
import { HotelsModule } from './hotels/hotels.module';
import { QuotesModule } from './quotes/quotes.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module'; // 1. Import AdminModule

import { User } from './users/user.entity';
import { Destination } from './destinations/destination.entity';
import { Package } from './packages/package.entity';
import { PackageImage } from './packages/package-image.entity';
import { Hotel } from './hotels/hotel.entity';
import { HotelImage } from './hotels/hotel-image.entity';
import { QuoteRequest } from './quotes/quote-request.entity';
import { QuoteResponse } from './quotes/quote-response.entity';
import { Conversation } from './quotes/conversation.entity';
import { Message } from './quotes/message.entity';
import { Payment } from './payments/payment.entity';
import { Subscription } from './payments/subscription.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'srv1859.hstgr.io',
        port: 3306,
        username: 'u260883056_mt',
        password: configService.get<string>('DB_PASSWORD'),
        database: 'u260883056_mahaan_tours',
        entities: [
          User,
          Destination,
          Package,
          PackageImage,
          Hotel,
          HotelImage,
          QuoteRequest,
          QuoteResponse,
          Conversation,
          Message,
          Payment,
          Subscription,
        ],
        synchronize: false,
      }),
    }),
    UsersModule,
    AuthModule,
    DestinationsModule,
    PackagesModule,
    HotelsModule,
    QuotesModule,
    PaymentsModule,
    AdminModule, // 2. Add AdminModule to the imports array
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
