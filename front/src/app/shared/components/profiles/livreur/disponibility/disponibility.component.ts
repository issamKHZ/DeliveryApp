import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ScheduleCalendarComponent } from '../../../../../content/schedule-calendar/schedule-calendar.component';
import { DayDescriptif } from '../../../../modele/livreur/day-descriptif';
import { DaySchedulerComponent } from "./day-scheduler/day-scheduler.component";
import { DisponibilityService } from '../../../../services/profile/livreur/disponibility/disponibility.service';
import { SubscriptionManager } from '../../../../utils/subscription-manager';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TimeService } from '../../../../services/time.service';
import { PLivreurCommonService } from '../../../../services/profile/livreur/p-livreur-common.service';

@Component({
  selector: 'app-disponibility',
  standalone: true,
  imports: [
    TranslateModule,
    ScheduleCalendarComponent,
    DaySchedulerComponent,
    CommonModule
  ],
  templateUrl: './disponibility.component.html',
  styleUrl: './disponibility.component.scss'
})
export class DisponibilityComponent extends SubscriptionManager implements OnInit, OnDestroy {

  daysIndipo: number[];
  livreurID: string;

  constructor(
    private route: ActivatedRoute,
    private timeService: TimeService,
    private livreurService: PLivreurCommonService
  ) {
    super();
  }

  ngOnInit(): void {
    this.register(
      this.route.data.subscribe(data => {
        this.daysIndipo = this.timeService.convertDaysToIndex(data['disponibility']);        
      }),

      this.livreurService.getProfileData().subscribe(data => {
        this.livreurID = data.id;
      })
    );
  }

  ngOnDestroy(): void {
    this.clean();
  }

}
