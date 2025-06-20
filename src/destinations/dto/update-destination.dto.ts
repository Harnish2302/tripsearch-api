import { PartialType } from '@nestjs/mapped-types';
import { CreateDestinationDto } from './create-destination.dto';

// This automatically creates a new type based on CreateDestinationDto,
// but with all fields marked as optional.
export class UpdateDestinationDto extends PartialType(CreateDestinationDto) {}