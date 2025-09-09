import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DisponibilityHttpService } from '../../services/profile/livreur/disponibility/disponibility.http.service';
import { PLivreurCommonService } from '../../services/profile/livreur/p-livreur-common.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const DisponibilityResolver: ResolveFn<string[]> = () => {
  const dispoService = inject(DisponibilityHttpService);
  const livreurService = inject(PLivreurCommonService);

  return livreurService.getProfileData().pipe(
    map(profile => profile.id),
    switchMap(livreurID => dispoService.getInspoDays(livreurID)),
    catchError(error => {
      console.error('Erreur dans DisponibilityResolver:', error);
      return of([]); 
    })
  );
};