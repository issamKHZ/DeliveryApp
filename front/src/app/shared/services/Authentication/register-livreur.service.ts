import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { RegistrationInfos } from '../../modele/RegistrationInfos';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterLivreurService {

  readonly API_URL = environment.apiAuthUrl;
  readonly REGISTER_LIVREUR_ENDPOINT = '/api/Authentication/register';

  constructor(private httpClient: HttpClient) { }

  register(user: RegistrationInfos): Observable<any> {
    return this.httpClient.post(this.API_URL + this.REGISTER_LIVREUR_ENDPOINT, user, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return throwError(() => error.error || error.message);
        }
        return throwError(() => 'Something went wrong; please try again later.');
      })
    );
  }
}
