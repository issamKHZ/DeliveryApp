import { Injectable } from '@angular/core';
import { EntrepriseRegistration } from '../modele/entrepriseRegistration';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RegistrationInfos } from '../modele/RegistrationInfos';

@Injectable({
  providedIn: 'root'
})
export class RegisterEntrepriseService {

  readonly API_URL = 'http://localhost:5269';
  readonly REGISTER_ENTREPRISE_ENDPOINT = '/api/Authentication/register';

  constructor(private httpClient: HttpClient) { }

  register(user: RegistrationInfos): Observable<any> {
    return this.httpClient.post(this.API_URL + this.REGISTER_ENTREPRISE_ENDPOINT, user, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {              
        return throwError(() => new Error(error.error || 'Something went wrong; please try again later.'));
      })
    );
  }
}
