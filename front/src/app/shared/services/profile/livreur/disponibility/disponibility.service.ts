import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DayDescriptif, Task } from '../../../../modele/livreur/day-descriptif';
import { DisponibilityHttpService } from './disponibility.http.service';

@Injectable({
  providedIn: 'root'
})
export class DisponibilityService {
  
  private _selectedDay = new BehaviorSubject<DayDescriptif | null>(null);
  selectedDay$ = this._selectedDay.asObservable();

  private _task = new BehaviorSubject<{task: Task, date: Date} | null>(null);
  task$ = this._task.asObservable();

  private _taskToDelete = new BehaviorSubject<{task: Task, date: Date} | null>(null);
  taskToDelete$ = this._taskToDelete.asObservable();

  private _taskToEdit = new BehaviorSubject<{oldTask: Task, task: Task, date: Date} | null>(null);
  taskToEdit$ = this._taskToEdit.asObservable();

  constructor() {}

  selectedDay(day: DayDescriptif): void {
    this._selectedDay.next(day);
  }

  task(task: Task, date: Date): void {
    this._task.next({task: task, date: date});
  }

  taskToDelete(task: Task, date: Date): void {
    this._taskToDelete.next({task: task, date: date});
  }

  taskToEdit(oldTask: Task, task: Task, date: Date): void {
    this._taskToEdit.next({oldTask: oldTask, task: task, date: date});
  }

  getLivreurSchedule(month: number, year: number, livID: string): DayDescriptif[] {
    return null;
  }
}
