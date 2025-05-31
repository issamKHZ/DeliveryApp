import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LivreurRegistration } from '../modele/livreurRegistration';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { RegistrationInfos } from '../modele/RegistrationInfos';

@Injectable({
  providedIn: 'root'
})
export class RegisterLivreurService {

  readonly API_URL = 'http://localhost:5269';
  readonly REGISTER_LIVREUR_ENDPOINT = '/api/Authentication/register';

  constructor(private httpClient: HttpClient) { }

  register(user: RegistrationInfos): Observable<any> {
    return this.httpClient.post(this.API_URL + this.REGISTER_LIVREUR_ENDPOINT, user, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );

    return of(true);
  }
}
