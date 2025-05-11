import { Injectable } from '@angular/core';
import { EntrepriseRegistration } from '../modele/entrepriseRegistration';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterEntrepriseService {

  readonly API_URL = 'http://localhost:9090';
  readonly REGISTER_ENTREPRISE_ENDPOINT = '/auth/register/entreprise';

  constructor(private httpClient: HttpClient) { }

  register(user: EntrepriseRegistration): Observable<any> {
    return this.httpClient.post(this.API_URL + this.REGISTER_ENTREPRISE_ENDPOINT, user, { responseType: 'text' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error || 'Something went wrong; please try again later.'));
      })
    );
  }
}
