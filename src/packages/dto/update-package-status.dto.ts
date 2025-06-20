// In src/packages/dto/update-package-status.dto.ts

import { IsEnum, IsNotEmpty } from 'class-validator';
import { PackageStatus } from '../package.entity';

export class UpdatePackageStatusDto {
  @IsEnum(PackageStatus)
  @IsNotEmpty()
  status: PackageStatus;
}