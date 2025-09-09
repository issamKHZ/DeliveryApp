import { Injectable } from '@angular/core';
import { AuthUser } from '../../modele/AuthUser';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError, firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  readonly API_URL = environment.apiAuthUrl;
  readonly LOGIN_ENDPOINT = '/api/Authentication/login';
  readonly SEND_RECOVER_ENDPOINT = '/api/Authentication/send-recover';
  readonly RESET_ENDPOINT = '/api/Authentication/reset-password';
  readonly PARTIAL_USER_ENDPOINT = '/api/Authentication/get-user';
  readonly USER_ID_ENDPOINT = '/api/Authentication/get-id';

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

  getPartialUser(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);

    return this.httpClient.get(`${this.API_URL}${this.PARTIAL_USER_ENDPOINT}`, {
      params,
      responseType: 'json'
    }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  async getCurrentUserIdByEmail(email: string): Promise<string> {
    const params = new HttpParams().set('email', email);

    return await firstValueFrom(
      this.httpClient.get(`${this.API_URL}${this.USER_ID_ENDPOINT}`, {
        params,
        responseType: 'text'
      }).pipe(
        catchError((error: HttpErrorResponse) => {
          throw new Error(error.error?.message || 'Something went wrong; please try again later.');
        })
      )
    );
  }
}
