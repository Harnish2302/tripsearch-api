import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import slugify from 'slugify';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packagesRepository: Repository<Package>,
  ) {}

  /**
   * Retrieves all packages from the database.
   * Images are loaded automatically due to the 'eager' setting on the entity.
   */
  findAll(): Promise<Package[]> {
    return this.packagesRepository.find();
  }

  /**
   * Finds a single package by its ID.
   * @param id The ID of the package to find.
   * @throws {NotFoundException} If no package with the given ID is found.
   */
  async findOne(id: number): Promise<Package> {
    const tourPackage = await this.packagesRepository.findOneBy({ id });
    if (!tourPackage) {
      throw new NotFoundException(`Package with ID #${id} not found`);
    }
    return tourPackage;
  }

  /**
   * Creates a new package. Automatically generates a URL-friendly slug from the title.
   * @param createPackageDto The data for the new package.
   */
  create(createPackageDto: CreatePackageDto): Promise<Package> {
    // Always generate the slug from the title for consistency.
    const slug = slugify(createPackageDto.title, {
      lower: true, // convert to lower case
      strict: true, // strip special characters
      remove: /[*+~.()'"!:@]/g, // remove characters that slugify might miss
    });

    // Combine the incoming DTO with the generated slug.
    const packageDataToCreate = {
      ...createPackageDto,
      slug: slug,
    };

    const tourPackage = this.packagesRepository.create(packageDataToCreate);
    return this.packagesRepository.save(tourPackage);
  }

  /**
   * Updates an existing package.
   * @param id The ID of the package to update.
   * @param updatePackageDto The new data for the package.
   * @throws {NotFoundException} If no package with the given ID is found.
   */
  async update(id: number, updatePackageDto: UpdatePackageDto): Promise<Package> {
    // This will not update relations correctly by default.
    // For a real-world app, you would need more complex logic here
    // to handle adding/removing/updating images.
    const tourPackage = await this.packagesRepository.preload({
      id: id,
      ...updatePackageDto,
    });
    if (!tourPackage) {
      throw new NotFoundException(`Package with ID #${id} not found`);
    }
    return this.packagesRepository.save(tourPackage);
  }

  /**
   * Deletes a package from the database.
   * @param id The ID of the package to delete.
   */
  async remove(id: number): Promise<void>
  {
    const tourPackage = await this.findOne(id);
    await this.packagesRepository.remove(tourPackage);
  }
}
