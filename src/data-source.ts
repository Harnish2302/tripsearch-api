import 'dotenv/config'; // Make sure .env variables are loaded
import { DataSource } from 'typeorm';
// ... all your entity imports
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
    QuoteRequest,
    QuoteResponse,
    Conversation,
    Message,
    Payment,
    Subscription,
  ],
  // This is the key change. It tells TypeORM to automatically update the
  // database schema to match the entities, without using migrations.
  synchronize: true,
  migrations: [], // We are no longer using migrations
});
