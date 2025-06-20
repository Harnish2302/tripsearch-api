// In src/admin/admin.controller.ts

import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { UpdateAgentStatusDto } from './dto/update-agent-status.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // --- Dashboard Endpoint ---
  @Get('dashboard-summary')
  getDashboardSummaryStats() {
    return this.adminService.getDashboardSummaryStats();
  }

  // --- Agent Management Endpoint ---
  @Patch('agents/:id/status')
  updateAgentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAgentStatusDto: UpdateAgentStatusDto,
  ) {
    return this.adminService.updateAgentStatus(id, updateAgentStatusDto.status);
  }
}
