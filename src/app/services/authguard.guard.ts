import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service'; 
import { Router } from '@angular/router';

export const authguardGuard: CanActivateFn = async (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = await authService.isLoggedIn();

  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }

};
