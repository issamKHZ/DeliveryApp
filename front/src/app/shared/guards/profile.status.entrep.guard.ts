import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { ProfileEntrepriseService } from '../services/profile/entreprise/profile-entreprise.service';
import { CommonService } from '../services/utils/common.service';
import { ComponentRoutageService } from '../services/component-routage.service';
import { RoutesEnum } from '../modele/enumerate/routes';

export const profileStatusEntrepGuard: CanActivateFn = (route, state) => {
  const profileService = inject(ProfileEntrepriseService);
  const commonService = inject(CommonService);
  const router = inject(Router);

  return profileService.isAllowedStatus().pipe(
    map((isAllowed: boolean) => {
      if (isAllowed) {
        return true;
      } else {
        router.navigate([commonService.composeRoute([RoutesEnum.PROFILE_ENTREPRISE, RoutesEnum.NOTALLOWED])]);
        return false;
      }
    }),
    catchError(() => {
      router.navigate([commonService.composeRoute([RoutesEnum.PROFILE_ENTREPRISE, RoutesEnum.NOTALLOWED])]);
      return of(false);
    })
  );
};