import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UserRoles } from '../../../modele/enumerate/userRoles';


@Injectable({
  providedIn: 'root'
})
export class ProfileEntrepriseService {

  private readonly API_URL = environment.apiProfileUrl;
  private readonly PROFILE_ENDPOINT = '/api/Entreprise/get';
  private readonly ADMINISTRATIF_ENDPOINT = '/api/Entreprise/administratif';
  private readonly GENERAL_ENDPOINT = '/api/Entreprise/general';
  private readonly SECTORS_ENDPOINT = '/api/Entreprise/sectors';
  private readonly STATUS_ENDPOINT = '/api/Entreprise/status';
  private readonly ENTREPRISE_NAME_ENDPOINT = '/api/Entreprise/name';
  private readonly LIVREUR_NAME_ENDPOINT = '/api/Livreur/name';

  constructor(private httpClient: HttpClient) { }

  getAllProfileInfos(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}${this.PROFILE_ENDPOINT}`, { responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }


  saveGeneralInfos(infos: FormData): Observable<any> {
    return this.httpClient.post(this.API_URL + this.GENERAL_ENDPOINT, infos, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }

  saveAdminInfos(infos: FormData): Observable<any> {
    return this.httpClient.post(this.API_URL + this.ADMINISTRATIF_ENDPOINT, infos, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }

  getSectorActivities(): Observable<any> {
    return this.httpClient.get(`${this.API_URL}${this.SECTORS_ENDPOINT}`, { responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  isAllowedStatus(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.API_URL}${this.STATUS_ENDPOINT}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error checking status:', error);
        return of(false);
      })
    );
  }

  getUserName(role: string, email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    let url = this.ENTREPRISE_NAME_ENDPOINT;
    if (role == UserRoles.LIVREUR.toString().toUpperCase()) {
      url = this.LIVREUR_NAME_ENDPOINT;
    }
    return this.httpClient.get(`${this.API_URL}${url}`, { params, responseType: 'text' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );

  }

}
