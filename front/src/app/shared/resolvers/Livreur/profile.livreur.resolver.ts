import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { catchError, of, tap } from "rxjs";
import { AuthService } from "../../services/Authentication/auth.service";
import { ProfileLivreurService } from "../../services/profile/livreur/profile-livreur.service";
import { PLivreurCommonService } from "../../services/profile/livreur/p-livreur-common.service";

export const LivreurProfileResolver: ResolveFn<{ message: string }> = () => {    
    const profileService = inject(ProfileLivreurService);
    const profileDataService = inject(PLivreurCommonService);
    const authService = inject(AuthService);
    
    return profileService.getAllProfileInfos().pipe(
        tap(data => {
            profileDataService.setProfileData(data);
        }),
        catchError(error => {
            authService.logout();
            return of(null);
        })
    );
};