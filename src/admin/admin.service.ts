// In src/admin/admin.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../users/user.entity';
import { Package } from '../packages/package.entity';
import { Hotel } from '../hotels/hotel.entity';
import { Destination } from '../destinations/destination.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Destination)
    private readonly destinationRepository: Repository<Destination>,
  ) {}

  // --- User Management ---

  async updateAgentStatus(agentId: number, status: UserStatus): Promise<User> {
    const agent = await this.userRepository.findOneBy({
      id: agentId,
      role: UserRole.AGENT,
    });

    if (!agent) {
      throw new NotFoundException(`Agent with ID #${agentId} not found.`);
    }

    agent.status = status;
    return this.userRepository.save(agent);
  }

  // --- Dashboard Statistics ---

  async getDashboardSummaryStats(): Promise<any> {
    const totalUsers = await this.userRepository.count();
    const totalAgents = await this.userRepository.count({
      where: { role: UserRole.AGENT },
    });
    const totalTravelers = await this.userRepository.count({
      where: { role: UserRole.TRAVELER },
    });
    const totalPackages = await this.packageRepository.count();
    const totalHotels = await this.hotelRepository.count();
    const totalDestinations = await this.destinationRepository.count();

    return {
      totalUsers,
      totalAgents,
      totalTravelers,
      totalPackages,
      totalHotels,
      totalDestinations,
    };
  }
}
