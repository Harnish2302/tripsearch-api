import { PartialType } from '@nestjs/mapped-types';
import { CreateDestinationDto } from './create-destination.dto';

// PartialType makes all fields from CreateDestinationDto optional.
// This is perfect for PATCH requests.
export class UpdateDestinationDto extends PartialType(CreateDestinationDto) {}