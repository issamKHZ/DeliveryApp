import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../../../modele/Notification';
import { NotifType } from '../../../modele/enumerate/NotifType';
import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { LargeContentFieldComponent } from '../../utils/large-content-field/large-content-field.component';
import { NotificationsService } from '../service/notifications.service';

const colors: { [key in NotifType]: string } = {
  [NotifType.ADMIN_RECLAMATION]: '#e02e2a',
  [NotifType.ADMIN_WARNING]: '#FFD166',
  [NotifType.INFO]: '#00B4D8',
  [NotifType.MESSAGE]: '#06D6A0',
};

@Component({
  selector: 'app-notif-card',
  standalone: true,
  imports: [CommonModule, LargeContentFieldComponent],
  templateUrl: './notif-card.component.html',
  styleUrl: './notif-card.component.scss'
})
export class NotifCardComponent implements OnInit {

  @Input() notif: Notification;
  @Input() size: String;
  currentCount: number;

  get textSize () {
    if (this.size == 'small') {
      return true;
    } else {
      return false;
    }
  }

  constructor(private notifService: NotificationsService) {

  }

  ngOnInit(): void {
    this.notifService.currentCount.subscribe(count => {
      this.currentCount = count;
    });

    if (this.notif) {
      this.notif.style = '0.35rem solid ' + colors[this.notif.type];
      this.notif.color = colors[this.notif.type];
    }
  }

  readNotif($event: MouseEvent) {
    $event.stopPropagation();
    if (!this.notif.readed) {
      this.notif.readed = true;
      this.currentCount--;
      this.notifService.updateCount(this.currentCount);
    }
  }

  formatNotifDate(notifDate: Date): string {
    // const notifDate = new Date(dateStr);
    const today = new Date();

    const isSameDay =
      notifDate.getDate() === today.getDate() &&
      notifDate.getMonth() === today.getMonth() &&
      notifDate.getFullYear() === today.getFullYear();

    const hours = notifDate.getHours().toString().padStart(2, '0');
    const minutes = notifDate.getMinutes().toString().padStart(2, '0');

    if (isSameDay) {
      return `${hours}:${minutes}`;
    } else {
      const day = notifDate.getDate().toString().padStart(2, '0');
      const month = (notifDate.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month} ${hours}:${minutes}`;
    }
  }
}
