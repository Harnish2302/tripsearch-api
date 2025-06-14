import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Finds all users in the database.
   * @returns A promise that resolves to an array of User objects.
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Finds a single user by their email address.
   * @param email The email of the user to find.
   * @returns A promise that resolves to a User object, or null if not found.
   */
  findOneByEmail(email: string): Promise<User | null> {
    // Corrected the return type to Promise<User | null>
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Creates a new user, hashes their password, and saves them to the database.
   * @param createUserDto The user data to create.
   * @returns A promise that resolves to the newly created User object without the password hash.
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    // Check if a user with this email already exists
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUserDto.password, salt);

    // Create a new user entity instance
    const newUser = this.usersRepository.create({
      ...createUserDto,
      passwordHash: passwordHash, // Map to the correct entity property
    });

    // Save the new user to the database
    const savedUser = await this.usersRepository.save(newUser);

    // IMPORTANT: Never return the password hash in the response.
    const { passwordHash: _, ...result } = savedUser;
    return result;
  }
}