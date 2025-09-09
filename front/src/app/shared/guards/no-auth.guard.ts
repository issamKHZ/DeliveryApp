import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutesEnum } from '../modele/enumerate/routes';
import { AuthService } from '../services/Authentication/auth.service';

export const NoAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true; 
  } else {
    router.navigate(['/']);
    return false;
  }
};
