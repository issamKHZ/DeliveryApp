import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ScheduleLine } from '../../../modele/scheduleLine';
import { Days } from '../../../modele/enumerate/Days';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { PLivreurCommonService } from '../../../services/profile/livreur/p-livreur-common.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-liv-schedule-dialog',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CheckboxModule,
    ButtonModule,
    DatePickerModule,
    ReactiveFormsModule
  ],
  templateUrl: './liv-schedule-dialog.component.html',
  styleUrl: './liv-schedule-dialog.component.scss'
})
export class LivScheduleDialogComponent implements OnInit {
  lines: ScheduleLine[];
  form: UntypedFormGroup;
  daysList: string[];

  constructor(
    private commonService: PLivreurCommonService,
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.daysList = Object.values(Days);
    this.lines = this.config.data.scheduleData;
    this.form = this.adaptScheduleToForm(this.lines);
  }

  adaptScheduleToForm(schedule: ScheduleLine[]): UntypedFormGroup {
    return this.fb.group({
      days: this.fb.group(
        schedule.reduce((daysGroup, line) => ({
          ...daysGroup,
          [line.day]: this.fb.group({
            start: [line.startHour ? new Date(line.startHour) : null],
            end: [line.endHour ? new Date(line.endHour) : null],
            indispo: [!line.dispo]
          }, { validators: [this.horaireValidator] })
        }), {})
      )
    });
  }

  horaireValidator(control: AbstractControl): ValidationErrors | null {
    const start = control.get('start')?.value;
    const end = control.get('end')?.value;
    const indispo = control.get('indispo')?.value;

    if (indispo) {
      return null;
    }

    if (!start || !end) {
      return null;
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate.getTime() >= endDate.getTime()) {
      return { incoherent: true };
    }

    return null;
  }

  updateValidation(day: string): void {
    const dayGroup = this.form.get('days').get(day);
    if (dayGroup) {
      dayGroup.updateValueAndValidity();
    }
  }

  saveSchedule() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); 
      return;
    }

    const updatedSchedule = this.commonService.convertFormToScheduleLines(this.form);
    this.ref.close(updatedSchedule);
  }

  cancel() {
    this.ref.close();
  }
}