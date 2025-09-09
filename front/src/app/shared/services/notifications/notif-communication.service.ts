import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifCommunicationService {

  constructor() { }

  private _selectAllNotifs = new BehaviorSubject<boolean | null>(null);
  selectAllNotifs$ = this._selectAllNotifs.asObservable();

  private _selectOneNotif = new BehaviorSubject<boolean | null>(null);
  selectOneNotif$ = this._selectOneNotif.asObservable();

  private notificationCount = new BehaviorSubject<number>(0);
  currentCount = this.notificationCount.asObservable();



  selectAll(selection: boolean): void {
    this._selectAllNotifs.next(selection);
  }

  selectOneNotif(selection: boolean): void {
    this._selectOneNotif.next(selection);
  }

  updateCount(count: number) {
    this.notificationCount.next(count);
  }
}
