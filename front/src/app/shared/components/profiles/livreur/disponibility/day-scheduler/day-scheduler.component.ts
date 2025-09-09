import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SubscriptionManager } from '../../../../../utils/subscription-manager';
import { DisponibilityService } from '../../../../../services/profile/livreur/disponibility/disponibility.service';
import { TimeService } from '../../../../../services/time.service';
import { LoadingService } from '../../../../utils/spinner/loading.service';
import { DisponibilityHttpService } from '../../../../../services/profile/livreur/disponibility/disponibility.http.service';
import { tap, filter, map, switchMap, finalize, catchError, of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScheduleDailyCell } from '../../../../../modele/livreur/schedule-daily-cell';
import { DispoDialogService } from '../../../../../services/profile/livreur/disponibility/dispo.dialog.service';
import { Task } from '../../../../../modele/livreur/day-descriptif';
import { LargeContentFieldComponent } from '../../../../utils/large-content-field/large-content-field.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogService } from '../../../../../services/utils/confirm.dialog.service';
import { TaskDialogMotif } from '../../../../dialogs/add-new-task/add-new-task.component';


export interface TimeInterval {
  start: number;
  end: number;
}


@Component({
  selector: 'app-day-scheduler',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ConfirmDialogModule,
    LargeContentFieldComponent
  ],
  templateUrl: './day-scheduler.component.html',
  styleUrl: './day-scheduler.component.scss',
})
export class DaySchedulerComponent extends SubscriptionManager implements OnInit, OnDestroy {


  dailySchedule: ScheduleDailyCell[];
  showDailyTasks: boolean;
  scheduleTitle: string;
  date: Date;

  tasksFromMonthlySc: Task[];


  @Input() livreurID: string;

  constructor(
    private dispoService: DisponibilityService,
    private dispoHttpService: DisponibilityHttpService,
    private dispoDialogService: DispoDialogService,
    private spinner: LoadingService,
    private timeService: TimeService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private myConfirmService: ConfirmDialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.showDailyTasks = false;
    this.register(
      this.dispoService.selectedDay$.pipe(
        tap(day => {
          this.showDailyTasks = day?.disponibility || false;

          if (day?.date) {
            this.date = day.date;
            this.scheduleTitle = this.timeService.transformeDateToDayString(day.date);
          }

          if (day?.tasks) {
            this.tasksFromMonthlySc = day.tasks;
          } else {
            this.tasksFromMonthlySc = [];
          }
        }),
        filter(day => !!day?.date && !!day?.disponibility),
        map(day => ({
          dayName: day!.date.toLocaleString("en-US", { weekday: "long" }).toUpperCase()
        })),
        tap(() => this.spinner.show()),
        switchMap(({ dayName }) =>
          this.dispoHttpService.getHoursInterval(this.livreurID, dayName).pipe(
            catchError(error => {
              return of(null);
            }),
            finalize(() => this.spinner.hide())
          )
        )
      ).subscribe({
        next: (response) => {
          if (response) {
            const timeInterval = {
              start: parseInt(response.start),
              end: parseInt(response.end)
            };

            if (this.tasksFromMonthlySc && this.tasksFromMonthlySc.length > 0) {

              this.tasksFromMonthlySc.sort((a, b) => {
                const dateA = new Date(a.startHour).getTime();
                const dateB = new Date(b.startHour).getTime();
                return dateA - dateB;
              });


              const firstTaskStart = new Date(this.tasksFromMonthlySc[0].startHour).getHours();
              const lastTaskEnd = new Date(this.tasksFromMonthlySc[this.tasksFromMonthlySc.length - 1].endHour).getHours();

              if (firstTaskStart < timeInterval.start) {
                timeInterval.start = firstTaskStart;
              }

              if (lastTaskEnd > timeInterval.end) {
                timeInterval.end = lastTaskEnd;
              }
            }

            this.buildTimeInterval(timeInterval);

          } else {
            this.buildTimeInterval();
          }
        },
        error: (error) => this.buildTimeInterval()
      })
    );
  }

  buildTimeInterval(timeInterval?: TimeInterval) {
    this.dailySchedule = [];

    const startHour = timeInterval?.start ?? 0;
    const endHour = timeInterval?.end ?? 23;

    const validStart = Math.max(0, Math.min(23, startHour));
    const validEnd = Math.max(0, Math.min(23, endHour));

    for (let hour = validStart; hour < validEnd; hour++) {
      const time = new Date();
      time.setHours(hour, 0, 0, 0);
      const slot = new ScheduleDailyCell({
        date: time,
      });
      this.dailySchedule.push(slot);
    }

    this.applyMonthlyTasks();
  }

  private applyMonthlyTasks() {
    if (!this.tasksFromMonthlySc || this.tasksFromMonthlySc.length === 0) {
      return;
    }

    this.tasksFromMonthlySc.forEach(task => {
      this.addTaskToSlot(task);
    });
  }

  openSlot(slot: ScheduleDailyCell) {
    if (!slot.task && !slot.task?.isContinuation) {
      const marge = this.getClosestTaskHour(slot);

      this.register(
        this.dispoDialogService.openAddDialog(TaskDialogMotif.ADD, this.livreurID, this.date, slot.date, marge)
          .subscribe({
            next: (data) => {
              if (data && data.motif == TaskDialogMotif.ADD) {
                console.log("add");
                
                this.addTaskToSlot(data.task);
                this.dispoService.task(data.task, this.date);
              }
            },
            error: (error) => console.error('Erreur lors de la création de la tâche:', error)
          })
      );
    }
  }

  addTaskToSlot(newTask: Task) {

    // convert dates 
    const start = new Date(newTask.startHour);
    const end = new Date(newTask.endHour);

    const startHour = start.getHours();
    const endHour = end.getHours();

    const startIndex = this.dailySchedule.findIndex(slot =>
      slot.date.getHours() === startHour
    );

    if (startIndex === -1) return;

    this.dailySchedule = this.dailySchedule.map((slot, index) => {
      const slotHour = slot.date.getHours();

      if (slotHour >= startHour && slotHour < endHour) {
        if (slotHour === startHour) {
          return {
            ...slot,
            task: newTask
          };
        } else {
          return {
            ...slot,
            task: {
              ...newTask,
              isContinuation: true
            },
            slotInTask: true
          };
        }
      }

      return slot;
    });

  }

  getClosestTaskHour(slot: ScheduleDailyCell): number {
    const slotFromSchedule = this.dailySchedule.find(d => d.date === slot.date);
    if (!slotFromSchedule) return 0;

    const slotIndex = this.dailySchedule.indexOf(slotFromSchedule);
    if (slotIndex === -1 || slotIndex === this.dailySchedule.length - 1) {
      return 0;
    }

    for (let i = slotIndex + 1; i < this.dailySchedule.length; i++) {
      if (this.dailySchedule[i].task && !this.dailySchedule[i].task.isContinuation) {
        return i - (slotIndex + 1);
      }
    }
    return this.dailySchedule.length - (slotIndex + 1);
  }

  delete(event: Event, task: Task) {
    event.stopPropagation();
    this.showCloseConfirmation(task);
  }

  edit($event: Event, slot: ScheduleDailyCell) {
    $event.stopPropagation();
    const oldTask = slot.task;
    const marge = this.getClosestTaskHour(slot);
    this.register(
      this.dispoDialogService.openAddDialog(TaskDialogMotif.EDIT, this.livreurID, this.date, null, marge, oldTask)
        .subscribe({
          next: (data) => {
            if (data && data.motif == TaskDialogMotif.EDIT) {                                        
              this.deleteTask(oldTask);
              this.addTaskToSlot(data.task);              
              this.dispoService.taskToEdit(oldTask, data.task, this.date);
            }
          },
          error: (error) => console.error('Erreur lors de la création de la tâche:', error)
        })
    );
  }

  private showCloseConfirmation(task: Task): void {
    this.confirmationService.confirm({
      message: this.translate.instant('app.profil.entreprise.administratif.confirmDialog.message'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onReject();
      },
      reject: () => {
        this.onAccept(task);
      },
      acceptLabel: this.translate.instant('app.common.buttons-label.cancel'),
      rejectLabel: this.translate.instant('app.common.buttons-label.yes'),
      acceptButtonStyleClass: 'cold-button',
      rejectButtonStyleClass: 'p-button-danger',
      closable: false,
      closeOnEscape: true,
      dismissableMask: true,
      key: 'closeConfirmation'
    });
  }

  onAccept(task: Task) {
    this.deleteTask(task)
    this.dispoService.taskToDelete(task, this.date);
  }

  onReject() {
    console.log();
  }

  deleteTask(task: Task): void {
    this.tasksFromMonthlySc = this.tasksFromMonthlySc.filter(t => t.startHour != task.startHour || t.endHour != task.endHour);
    this.dailySchedule.map(s => {
      if (s.task && s.task.startHour == task.startHour && s.task.endHour == task.endHour) {
        s.task = null;
        s.slotInTask = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.clean();
  }
}
