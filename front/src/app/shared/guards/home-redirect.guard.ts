import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoutesEnum } from '../modele/enumerate/routes';
import { AuthService } from '../services/auth.service';


export const HomeRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate([RoutesEnum.AUTH]);
  } else {
    authService.goToProfile();
  }
  return false;
};
