import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Body,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessControlGuard } from '../auth/access-control.guard';
import { Permissions } from '../decorators';
import { UserRole, PermissionActions } from '../types';

@Controller('users')
@UseGuards(AccessControlGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions(PermissionActions.MANAGE_USERS)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions(PermissionActions.MANAGE_USERS)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id/role')
  @Permissions(PermissionActions.MANAGE_USERS)
  updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
    @Req() req
  ) {
    // Prevent users from changing their own role
    if (+id === req.user.userId) {
      throw new ForbiddenException('Cannot change your own role');
    }

    return this.usersService.updateRole(+id, role);
  }

  @Delete(':id')
  @Permissions(PermissionActions.MANAGE_USERS)
  remove(@Param('id') id: string, @Req() req) {
    // Prevent users from deleting themselves
    if (+id === req.user.userId) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    return this.usersService.remove(+id);
  }
}
