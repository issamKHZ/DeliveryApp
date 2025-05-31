import { Component, Input, OnInit } from '@angular/core';
import { Notification } from '../../../modele/Notification';
import { NotifType } from '../../../modele/enumerate/NotifType';
import { NgClass, NgStyle } from '@angular/common';
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
  imports: [NgClass, NgStyle, LargeContentFieldComponent],
  templateUrl: './notif-card.component.html',
  styleUrl: './notif-card.component.scss'
})
export class NotifCardComponent implements OnInit {

  @Input() notif: Notification;
  currentCount: number;

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
}
