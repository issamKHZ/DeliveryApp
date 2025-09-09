import { CanActivateFn, Router } from '@angular/router';
import { ProfileLivreurService } from '../services/profile/livreur/profile-livreur.service';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { RoutesEnum } from '../modele/enumerate/routes';
import { CommonService } from '../services/utils/common.service';

export const profileStatusLivGuard: CanActivateFn = (route, state) => {
  const profileService = inject(ProfileLivreurService);
  const commonService = inject(CommonService);
  const router = inject(Router);

  return profileService.isAllowedStatus().pipe(
    map((isAllowed: boolean) => {
      if (isAllowed) {
        return true;
      } else {
        router.navigate([commonService.composeRoute([RoutesEnum.PROFILE_LIVREUR, RoutesEnum.NOTALLOWED])]);
        return false;
      }
    }),
    catchError(() => {
      router.navigate([commonService.composeRoute([RoutesEnum.PROFILE_LIVREUR, RoutesEnum.NOTALLOWED])]);
      return of(false);
    })
  );
};
