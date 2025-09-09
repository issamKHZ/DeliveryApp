import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Sieges } from '../../../../modele/entreprise/Sieges';

@Injectable({
  providedIn: 'root'
})
export class SiegeHttpService {


  private readonly API_URL = environment.apiOrdersUrl;
  private readonly TYPES_ENDPOINT = '/api/sites/types';
  private readonly DISPO_ENDPOINT = '/api/sites/disponibility';
  private readonly CITIES_ENDPOINT = '/api/sites/cities';
  private readonly SITES_ENDPOINT = '/api/sites/sites';
  private readonly EDIT_ENDPOINT = '/api/sites/edit';
  private readonly ADD_ENDPOINT = '/api/sites/add';

  constructor(private httpClient: HttpClient) { }

  getSitesTypes(): Observable<any> {

    return this.httpClient.get(`${this.API_URL}${this.TYPES_ENDPOINT}`, { responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  getDisponilities(): Observable<any> {

    return this.httpClient.get(`${this.API_URL}${this.DISPO_ENDPOINT}`, { responseType: 'json' }).pipe(
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
  getSites(id: string): Observable<any> {
    const params = new HttpParams().set('entrepriseID', id);
    return this.httpClient.get(`${this.API_URL}${this.SITES_ENDPOINT}`, { params, responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  addSite(infos: Sieges): Observable<any> {
    return this.httpClient.post(this.API_URL + this.ADD_ENDPOINT, infos, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }

  EditSites(infos: Sieges[]): Observable<any> {
    return this.httpClient.post(this.API_URL + this.EDIT_ENDPOINT, infos, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }

  deleteSites(ids: number[]): Observable<any> {
    return this.httpClient.delete(this.API_URL + this.SITES_ENDPOINT, {
      body: ids
    }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      }));
  }
}
