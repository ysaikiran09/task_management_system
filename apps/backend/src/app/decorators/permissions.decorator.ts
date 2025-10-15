import { SetMetadata } from '@nestjs/common';
import { PermissionActions } from '../types';

export const Permissions = (permission: PermissionActions) => 
  SetMetadata('permission', permission);