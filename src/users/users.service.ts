// src/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

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

  async findFeaturedAgents(): Promise<User[]> {
    return this.usersRepository.find({
      where: {
        role: UserRole.AGENT,
        status: UserStatus.ACTIVE,
        subscriptionTier: 'platinum',
      },
      take: 6,
    });
  }

  async findPopularAgents(): Promise<User[]> {
    const results = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.packages', 'package', 'package.status = :pkgStatus', { pkgStatus: 'approved' })
      .select('user')
      .addSelect('COUNT(package.id)', 'packageCount')
      .where('user.role = :role', { role: UserRole.AGENT })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
      .groupBy('user.id')
      .orderBy('packageCount', 'DESC')
      .limit(6)
      .getRawAndEntities();

      return results.entities;
  }
}
