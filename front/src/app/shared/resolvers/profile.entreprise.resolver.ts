import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { ProfileEntrepriseService } from "../services/profile/entreprise/profile-entreprise.service";
import { AuthService } from "../services/Authentication/auth.service";
import { LoadingService } from "../components/utils/spinner/loading.service";
import { switchMap, catchError, startWith, of, tap } from "rxjs";
import { ProfilEntrepCommonService } from "../services/profile/entreprise/pEntrepCommon.service";
import { AdminInfoEntreprise } from "../modele/entreprise/AdminInfoEntreprise";

export const EntrepriseProfileResolver: ResolveFn<AdminInfoEntreprise> = () => {
  const profileService = inject(ProfileEntrepriseService);
  const profileDataService = inject(ProfilEntrepCommonService);
  const authService = inject(AuthService);
  const spinner = inject(LoadingService);

  spinner.show();
  
  return profileService.getAllProfileInfos().pipe(
    tap(data => {
      profileDataService.setProfileData(data);
      profileDataService.setEntrepName(data.name);
    }),
    catchError(error => {
      authService.logout();
      return of(null);
    })
  );
};