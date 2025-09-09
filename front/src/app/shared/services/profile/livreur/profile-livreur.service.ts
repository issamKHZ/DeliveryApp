import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileLivreurService {

  private readonly API_URL = environment.apiProfileUrl;
  private readonly PROFILE_ENDPOINT = '/api/Livreur/get';
  private readonly EDIT_ENDPOINT = '/api/Livreur/edit';
  private readonly LANGUES_ENDPOINT = '/api/Livreur/langues';
  private readonly VEHICLE_ENDPOINT = '/api/Livreur/vehicles';
  private readonly STATUS_ENDPOINT = '/api/Livreur/status';

  constructor(private httpClient: HttpClient) { }

  getAllProfileInfos(): Observable<any> {

    return this.httpClient.get(`${this.API_URL}${this.PROFILE_ENDPOINT}`, { responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  saveLivreurProfil(infos: FormData): Observable<any> {
    return this.httpClient.post(this.API_URL + this.EDIT_ENDPOINT, infos, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }

  getLangues(): Observable<any> {

    return this.httpClient.get(`${this.API_URL}${this.LANGUES_ENDPOINT}`, { responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  getVehicles(): Observable<any> {

    return this.httpClient.get(`${this.API_URL}${this.VEHICLE_ENDPOINT}`, { responseType: 'json' }).pipe(
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
}
