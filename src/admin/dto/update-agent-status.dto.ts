// In src/admin/dto/update-agent-status.dto.ts

import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../users/user.entity';

export class UpdateAgentStatusDto {
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;
}
