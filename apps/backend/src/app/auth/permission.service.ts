import { Injectable } from '@nestjs/common';
import { UserRole, PermissionActions } from '../types';

@Injectable()
export class PermissionService {
  private roleHierarchy = {
    [UserRole.OWNER]: 3,
    [UserRole.ADMIN]: 2,
    [UserRole.VIEWER]: 1,
  };

  private permissions = {
    [UserRole.OWNER]: [
      PermissionActions.CREATE,
      PermissionActions.READ,
      PermissionActions.UPDATE,
      PermissionActions.DELETE,
      PermissionActions.MANAGE_USERS,
    ],
    [UserRole.ADMIN]: [
      PermissionActions.CREATE,
      PermissionActions.READ,
      PermissionActions.UPDATE,
      PermissionActions.DELETE,
    ],
    [UserRole.VIEWER]: [PermissionActions.READ],
  };

  hasPermission(role: UserRole, action: PermissionActions): boolean {
    return this.permissions[role]?.includes(action) || false;
  }

  canAccessOrganization(
    userOrgId: number,
    targetOrgId: number,
    userRole: UserRole
  ): boolean {
    if (userRole === UserRole.VIEWER) {
      return userOrgId === targetOrgId;
    }
    return this.hasHigherOrEqualRole(userRole, UserRole.ADMIN);
  }

  hasHigherOrEqualRole(userRole: UserRole, requiredRole: UserRole): boolean {
    return this.roleHierarchy[userRole] >= this.roleHierarchy[requiredRole];
  }
}
