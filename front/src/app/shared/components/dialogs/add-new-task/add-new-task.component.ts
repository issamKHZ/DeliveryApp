import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TimeService } from '../../../services/time.service';
import { TooltipModule } from 'primeng/tooltip';
import { Task } from '../../../modele/livreur/day-descriptif';
import { CommonService } from '../../../services/utils/common.service';
import { Title } from '@angular/platform-browser';

export enum TaskDialogMotif {
  ADD,
  EDIT
}

@Component({
  selector: 'app-add-new-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    InputNumberModule,
    CommonModule,
    TooltipModule
  ],
  templateUrl: './add-new-task.component.html',
  styleUrl: './add-new-task.component.scss'
})
export class AddNewTaskComponent implements OnInit, OnDestroy {

  livreurID: string;
  hour: Date;
  day: Date;
  slotsNumber: number;
  form: UntypedFormGroup;
  motif: TaskDialogMotif;
  task: Task;

  taskEnum = TaskDialogMotif;

  endHourOptions: string[];

  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private timeService: TimeService,
    private commonService: CommonService,
  ) {

  }

  ngOnInit(): void {
    const data = this.config.data;
    this.livreurID = data.livreurID;
    this.day = data.day;
    this.hour = data.startHour;
    this.slotsNumber = data.marge;
    this.motif = data.motif;
    this.task = data.task;

    this.form = this.fb.group({
      title: ["", Validators.required],
      startHour: [{ value: this.timeService.formatHour(this.hour), disabled: true }],
      endHour: [null, Validators.required],
      description: [""]
    }, {
      updateOn: 'submit'
    })

    this.endHourOptions = this.timeService.getNHoursAfterStart(this.hour, this.slotsNumber);

    if (this.motif == TaskDialogMotif.EDIT) {
      this.form = this.fb.group({
        title: [this.task.title, Validators.required],
        startHour: [{ value: this.timeService.formatHour(new Date(this.task.startHour)), disabled: true }],
        endHour: [this.timeService.formatHour(new Date(this.task.endHour)), Validators.required],
        description: [this.task.description]
      });

      this.endHourOptions = this.timeService.getNHoursAfterStart(new Date(this.task.startHour), this.slotsNumber);
    }



  }

  save() {
    if (this.form.valid) {
      let start = this.reformDates("startHour");
      let end = this.reformDates("endHour");

      let task = new Task({
        title: this.form.get("title")?.value,
        startHour: start,
        endHour: end,
        description: this.form.get("description")?.value
      })
      this.ref.close({task: task, motif: this.motif});
    } else {
      this.commonService.markAllFieldsAsDirty(this.form);
      this.form.markAllAsTouched();
    }

  }

  reformDates(dateKey: string): Date {
    let time = new Date();
    const hour = this.timeService.getHourFromString(this.form.get(dateKey)?.value);
    time.setHours(hour, 0, 0, 0);
    return time
  }

  close() {
    this.ref.close();
  }

  ngOnDestroy(): void {

  }
}
