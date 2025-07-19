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



  constructor(private fb: FormBuilder) {
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
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_WARNING,
      sub_type: "reclamation",
      readed: false,
    },
    {
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
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      type: NotifType.INFO,
      date: new Date(),
      sub_type: "reclamation",
      readed: false,
    },
    {
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.MESSAGE,
      sub_type: "reclamation",
      readed: false,
    },
    {
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
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_RECLAMATION,
      sub_type: "reclamation",
      readed: false,
    },


    {
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_WARNING,
      sub_type: "reclamation",
      readed: false,
    },
    {
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_RECLAMATION,
      sub_type: "reclamation",
      readed: false,
    },
    {
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      type: NotifType.INFO,
      date: new Date(),
      sub_type: "reclamation",
      readed: false,
    },
    {
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.MESSAGE,
      sub_type: "reclamation",
      readed: false,
    },
    {
      title: 'title test',
      subject: 'subject test',
      message: 'mesage message test',
      date: new Date(),
      type: NotifType.ADMIN_WARNING,
      sub_type: "reclamation",
      readed: false,
    }]
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
  }

  toggleSelectAll() {
    if (this.selectAllChecked) {
      this.selectedNotifCount = this.notifications.length;
    } else {
      this.selectedNotifCount = 0;
    }
    
  }


  ngOnDestroy(): void {

  }
}
