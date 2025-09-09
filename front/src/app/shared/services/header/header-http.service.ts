import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderHttpService {

  readonly API_URL = environment.apiAuthUrl;
  readonly VALIDATION_ENDPOINT = '/api/Authentication/validation-user';

  constructor(private httpClient: HttpClient) { }

  getUserAtValidation(mail: String): Observable<any> {
    const data = {email: mail};
    return this.httpClient.post(this.API_URL + this.VALIDATION_ENDPOINT, data, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }
}
