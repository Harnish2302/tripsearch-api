// In src/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // ADD THIS NEW METHOD
  /**
   * Finds all users. Replaces get_all_users.php
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found`);
    }
    return user;
  }
  
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { phone } });
  }

  async findUserWithPassword(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
        where: { email },
        select: ['id', 'email', 'passwordHash', 'role', 'status', 'firstName', 'lastName'],
    });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }
}