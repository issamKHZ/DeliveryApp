import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LivreurRegistration } from '../modele/livreurRegistration';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterLivreurService {

  readonly API_URL = 'http://localhost:9090';
  readonly REGISTER_LIVREUR_ENDPOINT = '/auth/register/livreur';

  constructor(private httpClient: HttpClient) { }

  register(user: LivreurRegistration): Observable<any> {
    return this.httpClient.post(this.API_URL + this.REGISTER_LIVREUR_ENDPOINT, user, { responseType: 'text' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error || 'Something went wrong; please try again later.'));
      })
    );
  }
}
