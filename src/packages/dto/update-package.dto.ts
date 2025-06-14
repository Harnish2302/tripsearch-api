import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';

// This automatically makes all fields from the CreatePackageDto optional.
export class UpdatePackageDto extends PartialType(CreatePackageDto) {}