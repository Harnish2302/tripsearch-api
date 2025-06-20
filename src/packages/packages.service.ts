// In src/packages/packages.service.ts

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package, PackageStatus } from './package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { User, UserRole } from '../users/user.entity';
import { Destination } from '../destinations/destination.entity';
import { PackageImage } from './package-image.entity';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packagesRepository: Repository<Package>,
    @InjectRepository(Destination)
    private destinationsRepository: Repository<Destination>,
  ) {}

  // --- THIS METHOD IS UPDATED ---
  async create(createPackageDto: CreatePackageDto, agent: User): Promise<Package> {
    const destination = await this.destinationsRepository.findOneBy({
      id: createPackageDto.destinationId,
    });
    if (!destination) {
      throw new NotFoundException(
        `Destination with ID #${createPackageDto.destinationId} not found.`,
      );
    }

    // Manually map properties to ensure type safety, fixing the errors.
    const newPackage = new Package();
    newPackage.title = createPackageDto.title;
    newPackage.description = createPackageDto.description;
    newPackage.price = createPackageDto.price;
    newPackage.duration = createPackageDto.duration;
    newPackage.agent = agent; // Securely assign the package to the logged-in agent
    newPackage.destination = destination;
    newPackage.status = PackageStatus.PENDING_APPROVAL; // New packages are always pending

    // Map optional properties only if they exist
    if (createPackageDto.discountPrice) newPackage.discountPrice = createPackageDto.discountPrice;
    if (createPackageDto.packageType) newPackage.packageType = createPackageDto.packageType;
    if (createPackageDto.hotelCategory) newPackage.hotelCategory = createPackageDto.hotelCategory;
    if (createPackageDto.inclusions) newPackage.inclusions = createPackageDto.inclusions;
    if (createPackageDto.exclusions) newPackage.exclusions = createPackageDto.exclusions;
    if (createPackageDto.tags) newPackage.tags = createPackageDto.tags;
    if (createPackageDto.itinerary) newPackage.itinerary = createPackageDto.itinerary;
    if (createPackageDto.maxParticipants) newPackage.maxParticipants = createPackageDto.maxParticipants;
    if (createPackageDto.minAge) newPackage.minAge = createPackageDto.minAge;
    if (createPackageDto.isFeatured) newPackage.isFeatured = createPackageDto.isFeatured;
    
    // Map the images
    newPackage.images = createPackageDto.images.map(imgDto => {
        const img = new PackageImage();
        img.imageUrl = imgDto.imageUrl;
        img.altText = imgDto.altText ?? '';
        img.sortOrder = imgDto.sortOrder ?? 0;
        return img;
    });

    return this.packagesRepository.save(newPackage);
  }

  // ... the rest of your service methods remain unchanged
  async findAllPublic(): Promise<Package[]> {
    return this.packagesRepository.find({
      where: { status: PackageStatus.APPROVED },
    });
  }

  async findOnePublic(id: number): Promise<Package> {
    const tourPackage = await this.packagesRepository.findOne({
      where: { id, status: PackageStatus.APPROVED },
    });
    if (!tourPackage) {
      throw new NotFoundException(`Package with ID #${id} not found or is not active.`);
    }
    tourPackage.viewCount++;
    return this.packagesRepository.save(tourPackage);
  }

  async findAllForAgent(agentId: number): Promise<Package[]> {
    return this.packagesRepository.find({
      where: { agent: { id: agentId } },
    });
  }

  async update(
    packageId: number,
    agentId: number,
    updatePackageDto: UpdatePackageDto,
  ): Promise<Package> {
    const tourPackage = await this.packagesRepository.findOne({
      where: { id: packageId, agent: { id: agentId } },
    });

    if (!tourPackage) {
      throw new NotFoundException(`Package with ID #${packageId} not found or you do not have permission to edit it.`);
    }

    Object.assign(tourPackage, updatePackageDto);
    tourPackage.status = PackageStatus.PENDING_APPROVAL;
    return this.packagesRepository.save(tourPackage);
  }
  
  async findAllPending(): Promise<Package[]> {
    return this.packagesRepository.find({
      where: { status: PackageStatus.PENDING_APPROVAL },
    });
  }
  
  async updateStatus(id: number, status: PackageStatus): Promise<Package> {
    const tourPackage = await this.packagesRepository.findOneBy({ id });
    if (!tourPackage) {
      throw new NotFoundException(`Package with ID #${id} not found.`);
    }
    tourPackage.status = status;
    return this.packagesRepository.save(tourPackage);
  }

  async remove(packageId: number, user: User): Promise<void> {
    let tourPackage: Package | null = null;

    if (user.role === UserRole.ADMIN) {
      tourPackage = await this.packagesRepository.findOneBy({ id: packageId });
    } else if (user.role === UserRole.AGENT) {
      tourPackage = await this.packagesRepository.findOne({
        where: { id: packageId, agent: { id: user.id } },
      });
    }

    if (!tourPackage) {
      throw new ForbiddenException(
        `Package with ID #${packageId} not found or you do not have permission to delete it.`,
      );
    }
    
    await this.packagesRepository.remove(tourPackage);
  }
}