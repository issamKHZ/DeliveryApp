import { Injectable } from '@angular/core';
import { DayDescriptif } from '../modele/livreur/day-descriptif';
import { Schedule } from '../modele/livreur/schedule';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  transformeDateToDayString(date: Date): string {
    const dateString = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return this.capitalizeFirstLetters(dateString);
  }

  capitalizeFirstLetters(str: string): string {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  convertDaysToIndex(days: string[]): number[] {
    const dayMap: { [key: string]: number } = {
      'monday': 0,
      'tuesday': 1,
      'wednesday': 2,
      'thursday': 3,
      'friday': 4,
      'saturday': 5,
      'sunday': 6,
    };

    return days.map(day => dayMap[day.toLowerCase()] ?? -1)
      .filter(index => index !== -1);
  }

  adapatDayDescriptifToSchedule(days: DayDescriptif[]): Schedule[] {
    if (!days) return [];

    return days.map(day => {
      return new Schedule({
        day: day.date.getDate(),
        month: day.date.getMonth(),
        year: day.date.getFullYear(),
        disponibility: day.disponibility,
        livreur_Tasks: day.tasks ?? []
      });
    });
  }

  adapatScheduleToDayDescriptif(schedules: Schedule[]): DayDescriptif[] {
    if (!schedules) return [];

    return schedules.map(schedule => {
      return new DayDescriptif({
        date: new Date(schedule.year, schedule.month, schedule.day),
        disponibility: schedule.disponibility,
        tasks: schedule.livreur_Tasks ?? []
      });
    });
  }

  formatHour(date: Date): string {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getNHoursAfterStart(startDate: Date, n: number): string[] {
    const timeSlots = [];

    for (let i = 1; i <= n + 1; i++) {
      const time = new Date(startDate);
      time.setHours(time.getHours() + i);
      timeSlots.push(this.formatHour(time));
    }

    return timeSlots;
  }

  getHourFromString(timeString: string): number {
    if (!timeString) return 0;
    
    const match = timeString.match(/(\d{1,2})[h:](\d{2})/);
    if (match) {
      return parseInt(match[1], 10);
    }
    
    const time = new Date(`1970-01-01T${timeString}`);
    return isNaN(time.getTime()) ? 0 : time.getHours();
  }
}
