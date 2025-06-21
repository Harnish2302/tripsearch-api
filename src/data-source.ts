// src/data-source.ts

import 'dotenv/config';
import { DataSource } from 'typeorm';
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

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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
  synchronize: true,
  migrations: [],
});
