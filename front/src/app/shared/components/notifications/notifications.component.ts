import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScrollerModule } from 'primeng/scroller';
import { NotifCardComponent } from "./notif-card/notif-card.component";
import { Notification } from '../../modele/Notification';
import { NotifCommunicationService } from '../../services/notifications/notif-communication.service';


@Component({
    selector: 'app-notifications',
    standalone: true,
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.scss',
    imports: [ScrollerModule, NotifCardComponent, CommonModule]
})
export class NotificationsComponent implements OnInit {

    @Input() items!: Notification[];
    @Input() isHeader!: boolean;
    @Input() selectionMode!: boolean;

    constructor(
        private notifCommunicationService: NotifCommunicationService
    ) { }

    ngOnInit() {
        this.notifCommunicationService.selectAllNotifs$.subscribe((value) => {
            this.items.map(n => n.selected = value); 
        })
    }

    handleSelectedNotif($event: number) {
        this.items.map(n => {
            if (n.id != $event) {n.opened = false}
        })
    }   
}