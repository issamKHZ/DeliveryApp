import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionManager } from '../../../utils/subscription-manager';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { SplitterModule } from 'primeng/splitter';
import { Notification } from '../../../modele/Notification';
import { NotifType } from '../../../modele/enumerate/NotifType';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { NotifCommunicationService } from '../../../services/notifications/notif-communication.service';

export enum SortStates {
  NEUTRE,
  ASC,
  DESC
}

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [TranslateModule,
    CommonModule,
    ButtonModule,
    RippleModule,
    SelectModule,
    DatePickerModule,
    InputIconModule,
    IconFieldModule,
    SplitterModule,
    InputTextModule,
    NotificationsComponent,
    ReactiveFormsModule,
    CheckboxModule,
    FormsModule,

  ],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss'
})
export class NotificationsPageComponent extends SubscriptionManager implements OnInit, OnDestroy {


  sortIcon: string;
  sortState: SortStates;
  sortClass: string;

  selectionMode: boolean;
  filterForm: UntypedFormGroup;

  typeOptions: any[];

  notifications: Notification[];
  selectAllChecked: boolean;
  selectedNotifCount: number;



  constructor(
    private fb: FormBuilder,
    private notifCommunicationService: NotifCommunicationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sortIcon = "pi pi-sort-alt"
    this.sortClass = "cold-button"
    this.sortState = SortStates.NEUTRE;

    this.filterForm = this.fb.group({
      type: [null],
      date: [null]
    });

    // get types from back
    this.typeOptions = [
      {
        label: "support",
        code: "SUPPORT"
      },
      {
        label: "message",
        code: "MSG"
      }
    ];

    this.selectedNotifCount = 0;

    this.notifications = [{
      id: 0,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_RECLAMATION,
      sub_type: "reclamation",
      readed: false,
      isFavoris: true
    },


    {
      id: 1,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_WARNING,
      sub_type: "reclamation",
      readed: false,
    },
    {
      id: 2,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_RECLAMATION,
      sub_type: "reclamation",
      readed: false,
      isFavoris: true
    },
    {
      id: 3,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      type: NotifType.INFO,
      date: new Date(),
      sub_type: "reclamation",
      readed: false,
    },
    {
      id: 4,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.MESSAGE,
      sub_type: "reclamation",
      readed: false,
    },
    {
      id: 5,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_WARNING,
      sub_type: "reclamation",
      readed: false,
      isFavoris: true
    },
    {
      id: 6,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_RECLAMATION,
      sub_type: "reclamation",
      readed: false,
    },


    {
      id: 7,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_WARNING,
      sub_type: "reclamation",
      readed: false,
    },
    {
      id: 8,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_RECLAMATION,
      sub_type: "reclamation",
      readed: false,
    },
    {
      id: 9,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      type: NotifType.INFO,
      date: new Date(),
      sub_type: "reclamation",
      readed: false,
    },
    {
      id: 10,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.MESSAGE,
      sub_type: "reclamation",
      readed: false,
    },
    {
      id: 11,
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_WARNING,
      sub_type: "reclamation",
      readed: false,
    }]

    this.notifCommunicationService.selectOneNotif$.subscribe(() => {
      this.selectedNotifCount = this.notifications.filter(n => n.selected === true).length;
      this.selectAllChecked = this.selectedNotifCount === this.notifications.length;      
    });
  }

  sortNotifs(): void {
    switch (this.sortState) {
      case SortStates.NEUTRE:
        this.sortState = SortStates.DESC;
        this.sortIcon = "pi pi-sort-amount-down";
        this.sortClass = "cold-button-focus";
        break;
      case SortStates.ASC:
        this.sortState = SortStates.NEUTRE;
        this.sortIcon = "pi pi-sort-alt";
        this.sortClass = "cold-button";
        break;
      case SortStates.DESC:
        this.sortState = SortStates.ASC;
        this.sortIcon = "pi pi-sort-amount-up";
        this.sortClass = "cold-button-focus";
        break;
      default:
        break;
    }
  }

  toggleSelection() {
    this.selectionMode = !this.selectionMode;
    this.selectAllChecked = false;
    this.notifications.map(n => n.selected = false);
    this.selectedNotifCount = 0;
  }

  toggleSelectAll() {
    if (this.selectAllChecked) {
      this.selectedNotifCount = this.notifications.length;
      this.notifCommunicationService.selectAll(true);
    } else {
      this.selectedNotifCount = 0;
      this.notifCommunicationService.selectAll(false);
    }

  }


  ngOnDestroy(): void {

  }
}
