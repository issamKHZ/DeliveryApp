import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersFilterInfosService {

  private readonly API_URL = environment.apiOrdersUrl
  private readonly ORDER_STATUS_ENDPOINT = '/api/orders/deliv-status';
  private readonly ORDER_MODE_ENDPOINT = '/api/orders/deliv-modes';
  private readonly CITIES_ENDPOINT = '/api/orders/cities'
  private readonly SITES_ENDPOINT = '/api/orders/sites'

  constructor(private httpClient: HttpClient) { }

  getOrderStatus(): Observable<any> {

    return this.httpClient.get(`${this.API_URL}${this.ORDER_STATUS_ENDPOINT}`, { responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  getOrderModes(): Observable<any> {

    return this.httpClient.get(`${this.API_URL}${this.ORDER_MODE_ENDPOINT}`, { responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  getCities(): Observable<any> {

    return this.httpClient.get(`${this.API_URL}${this.CITIES_ENDPOINT}`, { responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  getEntrepriseSites(id: string): Observable<any> {
    const params = new HttpParams().set('entrepriseID', id);
    return this.httpClient.get(`${this.API_URL}${this.SITES_ENDPOINT}`, { params, responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }
}
