import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  const currentUser = authService.getCurrentUser();
  
  if (token && currentUser) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  const currentUser = authService.getCurrentUser();
  
  if (token && currentUser) {
    router.navigate(['/tasks']);
    return false;
  } else {
    return true;
  }
};