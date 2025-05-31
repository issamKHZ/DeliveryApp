import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../../../modele/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private notificationCount = new BehaviorSubject<number>(0);
  currentCount = this.notificationCount.asObservable();

  updateCount(count: number) {
    this.notificationCount.next(count);
  }

  getUnreadedNotif(notifications: Notification[]) : number{
    if (notifications) {
      return notifications.filter(n => n.readed == false).length;
    }    
    return 0;
  }
}
