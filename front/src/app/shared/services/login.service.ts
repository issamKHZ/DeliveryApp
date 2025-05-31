import { Injectable } from '@angular/core';
import { AuthUser } from '../modele/AuthUser';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  readonly API_URL = 'http://localhost:5269';
  readonly LOGIN_ENDPOINT = '/api/Authentication/login';
  readonly SEND_RECOVER_ENDPOINT = '/api/Authentication/send-recover';
  readonly RESET_ENDPOINT = '/api/Authentication/reset-password';

  constructor(private httpClient: HttpClient) { }

  login(user: AuthUser): Observable<any> {
    return this.httpClient.post(this.API_URL + this.LOGIN_ENDPOINT, user, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }

  sendRecoverPwd(mail: any): Observable<any> {
    let params = new HttpParams().set('email', mail);
    return this.httpClient.post(`${this.API_URL + this.SEND_RECOVER_ENDPOINT}`, null, {
      params,
      responseType: 'json'
    }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error || 'Something went wrong; please try again later.'));
      })
    );
  }

  resetPassword(token: string, password: string): Observable<any> {
    let data = {
      resetToken: token,
      password: password
    }
    return this.httpClient.post(this.API_URL + this.RESET_ENDPOINT, data, { responseType: 'text' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }
}
