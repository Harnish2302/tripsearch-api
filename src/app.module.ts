// src/app.module.ts

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
import { AdminModule } from './admin/admin.module';
import { AdBookingsModule } from './ad-bookings/ad-bookings.module';
import { SearchLogsModule } from './search-logs/search-logs.module';

import { User } from './users/user.entity';
import { Destination } from './destinations/destination.entity';
import { Package } from './packages/package.entity';
import { PackageImage } from './packages/package-image.entity';
import { Hotel } from './hotels/hotel.entity';
import { HotelImage } from './hotels/hotel-image.entity';
import { HotelRoomType } from './hotels/hotel-room-type.entity';
import { QuoteRequest } from './quotes/quote-request.entity';
import { QuoteResponse } from './quotes/quote-response.entity';
import { Conversation } from './quotes/conversation.entity';
import { Message } from './quotes/message.entity';
import { Payment } from './payments/payment.entity';
import { Subscription } from './payments/subscription.entity';
import { AdBooking } from './ad-bookings/ad-booking.entity';
import { PasswordReset } from './auth/password-reset.entity';
import { SearchLog } from './search-logs/search-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT', '3306'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        // Use the DB_DATABASE from environment variables
        database: configService.get<string>('DB_DATABASE'), 
        entities: [
          User,
          Destination,
          Package,
          PackageImage,
          Hotel,
          HotelImage,
          HotelRoomType,
          QuoteRequest,
          QuoteResponse,
          Conversation,
          Message,
          Payment,
          Subscription,
          AdBooking,
          PasswordReset,
          SearchLog,
        ],
        synchronize: true, // This will create the schema automatically
      }),
    }),
    UsersModule,
    AuthModule,
    DestinationsModule,
    PackagesModule,
    HotelsModule,
    QuotesModule,
    PaymentsModule,
    AdminModule,
    AdBookingsModule,
    SearchLogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
