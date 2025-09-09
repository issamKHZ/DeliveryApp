import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddNewTaskComponent, TaskDialogMotif } from '../../../../components/dialogs/add-new-task/add-new-task.component';
import { Observable } from 'rxjs';
import { Task } from '../../../../modele/livreur/day-descriptif';

@Injectable({
  providedIn: 'root'
})
export class DispoDialogService {

  ref: DynamicDialogRef;

  constructor(
    private dynamicDialog: DialogService,
    private translate: TranslateService
  ) { }

  openAddDialog(motif: TaskDialogMotif, id: string, day: Date, startHour?: Date, marge?: number, task?: Task): Observable<any> {
    this.ref = this.dynamicDialog.open(AddNewTaskComponent, {
      header: this.translate.instant('app.profil.livreur.dispo.dialog.add.new-task.header'),
      data: {
        motif: motif,
        livreurID: id,
        day: day,
        startHour: startHour,
        marge: marge,
        task: task,
      },
      width: '30vw',
      closable: false,
      focusOnShow: false,
      modal: true,
      closeOnEscape: false,
      dismissableMask: false,
    });

    return this.ref.onClose;
  }
}
