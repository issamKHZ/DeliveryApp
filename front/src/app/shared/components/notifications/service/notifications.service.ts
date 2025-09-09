import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../../../modele/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {  

  getUnreadedNotif(notifications: Notification[]) : number{
    if (notifications) {
      return notifications.filter(n => n.readed == false).length;
    }    
    return 0;
  }
}
