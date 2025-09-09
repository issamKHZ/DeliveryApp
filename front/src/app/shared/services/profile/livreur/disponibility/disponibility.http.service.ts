import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ScheduleTime } from '../../../../modele/livreur/schedule-time';
import { DayDescriptif } from '../../../../modele/livreur/day-descriptif';
import { Schedule } from '../../../../modele/livreur/schedule';

@Injectable({
  providedIn: 'root'
})
export class DisponibilityHttpService {

  constructor(private httpClient: HttpClient) { }

  private readonly API_URL = environment.apiOrdersUrl;
  private readonly PROFILE_API_URL = environment.apiProfileUrl;
  private readonly SCHEDULE_ENDPOINT = '/api/disponibility/schedule';
  private readonly ADD_SCHEDULE_ENDPOINT = '/api/disponibility/add';
  private readonly DISPO_ENDPOINT = '/api/livreur/dispo';
  private readonly HOURS_ENDPOINT = '/api/livreur/hours';

  getScheduleByMonth(infos: ScheduleTime): Observable<any> {
    return this.httpClient.post(this.API_URL + this.SCHEDULE_ENDPOINT, infos, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }

  getInspoDays(id: string): Observable<any> {
    const params = new HttpParams().set('livreurID', id);
    return this.httpClient.get(`${this.PROFILE_API_URL}${this.DISPO_ENDPOINT}`, { params, responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }

  saveSchedule(livreurID: string, schedule: Schedule[]): Observable<any> {
    const data = {
      livreurID: livreurID,
      days: schedule
    }
    return this.httpClient.post(this.API_URL + this.ADD_SCHEDULE_ENDPOINT, data, { responseType: 'json' }).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error || 'Something went wrong; please try again later.');
      })
    );
  }

  getHoursInterval(livreurID: string, day: string): Observable<any> {
    const params = new HttpParams().set('livreurID', livreurID)
                                   .set('day', day);
    return this.httpClient.get(`${this.PROFILE_API_URL}${this.HOURS_ENDPOINT}`, { params, responseType: 'json' }).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error(error.error?.message || 'Something went wrong; please try again later.'));
      })
    );
  }
}
