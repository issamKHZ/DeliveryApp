import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionManager } from '../../../utils/subscription-manager';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { SplitterModule } from 'primeng/splitter';

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
    SelectModule,
    DatePickerModule,
    InputIconModule,
    IconFieldModule,
    SplitterModule,
    InputTextModule,
    ReactiveFormsModule],
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
    ]
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

  ngOnDestroy(): void {

  }
}
