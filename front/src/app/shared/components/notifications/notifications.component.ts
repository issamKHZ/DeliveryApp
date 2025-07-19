import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ScrollerModule } from 'primeng/scroller';
import { NotifCardComponent } from "./notif-card/notif-card.component";
import { Notification } from '../../modele/Notification';


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

    constructor() { }

    ngOnInit() {
        
    }    
}