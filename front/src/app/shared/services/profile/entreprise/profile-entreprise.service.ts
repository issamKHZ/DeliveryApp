import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AdminInfoEntreprise } from '../../../modele/entreprise/AdminInfoEntreprise';
import { PersonelInfosEntreprise } from '../../../modele/entreprise/PersonelInfosEntreprise';


@Injectable({
  providedIn: 'root'
})
export class ProfileEntrepriseService {

  private readonly API_URL = environment.apiUrl;
  private readonly ADMINISTRATIF_ENDPOINT = '/api/Profile/administratif';
  private readonly GENERAL_ENDPOINT = '/api/Profile/general';

  constructor(private httpClient: HttpClient) { }

  saveGeneralInfos(infos: PersonelInfosEntreprise): Observable<any> {
    return this.httpClient.post(this.API_URL + this.GENERAL_ENDPOINT, infos, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }

  saveAdminInfos(infos: AdminInfoEntreprise): Observable<any> {
    return this.httpClient.post(this.API_URL + this.ADMINISTRATIF_ENDPOINT, infos, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }

}
