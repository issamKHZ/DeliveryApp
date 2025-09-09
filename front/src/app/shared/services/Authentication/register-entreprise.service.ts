import { Injectable } from '@angular/core';
import { EntrepriseRegistration } from '../../modele/entreprise/entrepriseRegistration';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RegistrationInfos } from '../../modele/RegistrationInfos';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterEntrepriseService {

  readonly API_URL = environment.apiAuthUrl;
  readonly REGISTER_ENTREPRISE_ENDPOINT = '/api/Authentication/register';

  constructor(private httpClient: HttpClient) { }

  register(user: RegistrationInfos): Observable<any> {
    return this.httpClient.post(this.API_URL + this.REGISTER_ENTREPRISE_ENDPOINT, user).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 409) {
                return throwError(() => error.error || error.message);
            }
            return throwError(() => 'Something went wrong; please try again later.');
        })
    );
}
}
