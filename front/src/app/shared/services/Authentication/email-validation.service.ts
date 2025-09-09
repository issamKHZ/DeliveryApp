import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { RegistrationInfos } from '../../modele/RegistrationInfos';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailValidationService {

  private readonly API_URL = environment.apiAuthUrl;
  private readonly EMAIL_VALIDATION_ENDPOINT = '/api/Authentication/email-validation';
  private readonly SEND_EMAIL_VALIDATION_ENDPOINT = '/api/Authentication/email-validation';

  constructor(private httpClient: HttpClient) { }

  validate(token: string): Observable<any> {
    const params = new HttpParams().set('validationToken', token);

    return this.httpClient.get(`${this.API_URL}${this.EMAIL_VALIDATION_ENDPOINT}`, {
      params,
      responseType: 'json'
    }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  sendEmailValidation(mail: string): Observable<any> {
    let params = new HttpParams().set('email', mail);
    return this.httpClient.post(`${this.API_URL + this.SEND_EMAIL_VALIDATION_ENDPOINT}`, null, {
      params,
      responseType: 'json'
    }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {              
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }

}
