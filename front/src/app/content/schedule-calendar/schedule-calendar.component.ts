import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Days } from '../../shared/modele/enumerate/Days';
import { RippleModule } from 'primeng/ripple';
import { DayDescriptif, Task } from '../../shared/modele/livreur/day-descriptif';
import { SelectModule } from 'primeng/select';
import { CommonService } from '../../shared/services/utils/common.service';
import { DisponibilityService } from '../../shared/services/profile/livreur/disponibility/disponibility.service';
import { BadgeModule } from 'primeng/badge';
import { SubscriptionManager } from '../../shared/utils/subscription-manager';
import { DisponibilityHttpService } from '../../shared/services/profile/livreur/disponibility/disponibility.http.service';
import { ScheduleTime } from '../../shared/modele/livreur/schedule-time';
import { LoadingService } from '../../shared/components/utils/spinner/loading.service';
import { TimeService } from '../../shared/services/time.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-schedule-calendar',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    SelectModule,
    FormsModule,
    BadgeModule,
    TranslateModule
  ],
  templateUrl: './schedule-calendar.component.html',
  styleUrl: './schedule-calendar.component.scss'
})
export class ScheduleCalendarComponent extends SubscriptionManager implements OnInit, OnDestroy {


  @Input() indispoDays: number[];
  @Input() livreurID: string;

  currentDate = signal(new Date());
  selectedDate = signal<Date | null>(null);
  selectedDay = signal<DayDescriptif | null>(null);
  selectedYear: number;

  // actualSchedule: DayDescriptif[];

  firstDayOfWeek: number = 1;

  schedule: DayDescriptif[] = [];

  scheduleEdited: boolean = false;
  pendingPeriod: ScheduleTime | null = null;
  pendingDate: Date | null = null;

  constructor(private translate: TranslateService,
    private commonService: CommonService,
    private confirmationService: ConfirmationService,
    private disponibiltyService: DisponibilityService,
    private dispoHttpService: DisponibilityHttpService,
    private spinner: LoadingService,
    private timeService: TimeService,
    private message: MessageService
  ) {
    super();
  }

  ngOnInit(): void {    
    this.selectDate(null);
    this.selectedYear = this.getYear();
    const period = new ScheduleTime({
      month: this.getMonthIndex(),
      year: this.selectedYear,
      livreurID: this.livreurID
    })
    this.loadSchedule(period);

    this.register(
      this.disponibiltyService.task$.subscribe(data => {
        if (data) {
          this.addTask(data.task, data.date);
        }

      }),

      this.disponibiltyService.taskToDelete$.subscribe(data => {
        if (data) {
          this.deleteTask(data.task, data.date);
        }
      }),

      this.disponibiltyService.taskToEdit$.subscribe(data => {
        if (data) {
          this.deleteTask(data.oldTask, data.date);
          this.addTask(data.task, data.date);
        }
      })
    )
  }

  loadSchedule(period: ScheduleTime): void {
    this.spinner.show();
    this.register(
      this.dispoHttpService.getScheduleByMonth(period).subscribe({
        next: (response) => {
          if (response) {
            this.schedule = this.timeService.adapatScheduleToDayDescriptif(response);
            this.spinner.hide();
          }
        },
        error: (error) => {
          this.schedule = [];
          this.spinner.hide();
        }
      })
    );
  }

  @Output() dateSelected = new EventEmitter<DayDescriptif>();

  getMonthName(): string {
    return this.commonService.capitalizeFirstLetter(this.currentDate().toLocaleString('default', { month: 'long' }));
  }

  getMonthIndex(): number {
    return this.currentDate().getMonth();
  }

  getYear(): number {
    this.selectedYear = this.currentDate().getFullYear();
    return this.selectedYear;
  }

  getSelectedDateUnavailability(): boolean {
    if (!this.selectedDay()) return false;
    return this.isDayUnavailable(this.selectedDay());
  }

  getYears(): number[] {
    const years: number[] = [];
    const currentYear = this.getYear();

    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }

    return years;
  }

  setDateByYear() {
    const newDate = new Date(this.currentDate());
    newDate.setFullYear(this.selectedYear);
    this.switchPeriod(newDate);
  }

  getWeekDays(): string[] {
    const days = Object.values(Days);
    return days.map(day => this.translate.instant('app.profil.livreur.info-perso.schedule.days.' + day));
  }

  isDayUnavailable(day: DayDescriptif): boolean {
    return !day.disponibility;
  }

  getDays(): (DayDescriptif | null)[] {
    const year = this.currentDate().getFullYear();
    const month = this.currentDate().getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let firstDayIndex = firstDay.getDay();

    if (this.firstDayOfWeek === 1) {
      firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    }

    const daysInMonth = lastDay.getDate();

    const days: (DayDescriptif | null)[] = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(Date.UTC(year, month, i));
      const dayDescriptif = new DayDescriptif({
        date: date,
        disponibility: true
      });
      days.push(dayDescriptif);
    }

    const totalCells = Math.ceil(days.length / 7) * 7;
    const remainingCells = totalCells - days.length;

    for (let i = 0; i < remainingCells; i++) {
      days.push(null);
    }

    for (let i = 0; i < days.length; i++) {
      if (this.indispoDays.includes(i % 7)) {
        if (days[i]) {
          days[i].disponibility = false;
        }
      }
    }

    for (let i = 0; i < this.schedule.length; i++) {
      let day = days.find(d => d && this.compareDatesWithoutTime(d.date, this.schedule[i].date));
      if (day) {
        day.disponibility = this.schedule[i].disponibility;
        day.tasks = this.schedule[i].tasks;
      }
    }


    return days;


  }

  previousMonth(): void {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() - 1);
    this.switchPeriod(newDate);
  }

  nextMonth(): void {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() + 1);
    this.switchPeriod(newDate);
  }

  selectDate(dayDescriptif: DayDescriptif): void {
    this.selectedDate.set(dayDescriptif?.date);
    this.selectedDay.set(dayDescriptif);

    // this.dateSelected.emit(dayDescriptif);
    this.disponibiltyService.selectedDay(dayDescriptif);
  }

  isToday(dayDescriptif: DayDescriptif, dayToCompare?: Date): boolean {
    const today = dayToCompare ?? new Date();
    return dayDescriptif.date.getDate() === today.getDate() &&
      dayDescriptif.date.getMonth() === today.getMonth() &&
      dayDescriptif.date.getFullYear() === today.getFullYear();
  }

  compareDatesWithoutTime(date1: Date, date2: Date) {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }

  isSelected(dayDescriptif: DayDescriptif): boolean {
    const selected = this.selectedDay();
    return selected !== null &&
      this.compareDatesWithoutTime(dayDescriptif.date, selected.date);
  }

  // Méthode pour marquer une date comme indisponible
  toggleAvailability(): void {
    const selected = this.selectedDay();
    if (!selected) return;

    this.selectedDay().disponibility = !this.selectedDay().disponibility

    this.disponibiltyService.selectedDay(this.selectedDay());

    //mise a jour de schedule
    let day = this.schedule.find(s => this.compareDatesWithoutTime(s.date, this.selectedDay().date));
    if (day) {
      day.disponibility = this.selectedDay().disponibility;
    } else {
      this.schedule.push(this.selectedDay());
    }

    this.scheduleEdited = true;

    // Forcer le recalcul des jours
    this.currentDate.set(new Date(this.currentDate()));

  }

  returnToActuelDay() {
    const newDate = new Date();
    this.switchPeriod(newDate);
  }

  saveSchedule() {
    const sc = this.timeService.adapatDayDescriptifToSchedule(this.schedule);

    this.register(
      this.dispoHttpService.saveSchedule(this.livreurID, sc).subscribe({
        next: () => {
          this.message.add({
            severity: 'success', summary: this.translate.instant('app.profil.livreur.dispo.messages.edit-schedule-success.summary'),
            detail: this.translate.instant('app.profil.livreur.dispo.messages.edit-schedule-success.detail'), life: 4000
          });
          this.scheduleEdited = false;
        },
        error: (error) => {
          this.message.add({
            severity: 'error', summary: this.translate.instant('app.profil.livreur.dispo.messages.edit-schedule-error.summary'),
            detail: this.translate.instant('app.profil.livreur.dispo.messages.edit-schedule-error.detail'), life: 4000
          });
        }
      })
    );

  }

  showPeriodSwitchConfirmation(period: ScheduleTime) {

    this.pendingPeriod = period;

    this.confirmationService.confirm({
      message: this.translate.instant('app.profil.livreur.dispo.dialog.switch-period.message'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onReject(period);
      },
      reject: () => {
        this.onAccept();
      },
      acceptLabel: this.translate.instant('app.common.buttons-label.cancel'),
      rejectLabel: this.translate.instant('app.common.buttons-label.yes'),
      acceptButtonStyleClass: 'cold-button',
      rejectButtonStyleClass: 'p-button-success',
      closeOnEscape: false,
      closable: false,
      dismissableMask: true,
      key: 'periodSwitch',
    });
  }

  onReject(period: ScheduleTime) {
    this.loadSchedule(period);
    this.currentDate.set(this.pendingDate);
    this.selectedDate.set(null);
    this.selectedDay.set(null);
    this.scheduleEdited = false;
  }

  onAccept() {
    this.saveSchedule();
    this.loadSchedule(this.pendingPeriod);
    this.selectedDate.set(null);
    this.selectedDay.set(null);
    this.scheduleEdited = false;
  }

  switchPeriod(date: Date): void {
    const period = new ScheduleTime({
      month: date.getMonth(),
      year: date.getFullYear(),
      livreurID: this.livreurID
    })
    this.pendingDate = date;
    if (this.scheduleEdited) {
      this.showPeriodSwitchConfirmation(period);
    } else {
      this.onReject(period);
    }
  }

  deleteTask(task: Task, date: Date): void {
    let sc = this.schedule.find(s => this.compareDatesWithoutTime(s.date, date));
    if (sc) {
      sc.tasks = sc.tasks.filter(t => t.startHour != task.startHour || t.endHour != task.endHour);
      this.scheduleEdited = true;
    }
  }
  addTask(task: Task, date: Date): void {
    let sc = this.schedule.find(s => this.compareDatesWithoutTime(s.date, date));

    if (sc) {
      sc.tasks.push(task);
    } else {
      sc = new DayDescriptif({
        date: date,
        disponibility: true,
        tasks: [task]
      });
      this.schedule.push(sc);
    }

    this.scheduleEdited = true;
  }

  ngOnDestroy() {
    this.clean();
  }
}