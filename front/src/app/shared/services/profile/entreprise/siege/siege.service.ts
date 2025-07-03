import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddSiegeComponent } from '../../../../components/dialogs/add-siege/add-siege.component';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Sieges } from '../../../../modele/entreprise/Sieges';

@Injectable({
  providedIn: 'root'
})
export class SiegeService {

  ref: DynamicDialogRef;

  private _showSelection = new BehaviorSubject<boolean | null>(null);
  showSelection$ = this._showSelection.asObservable();

  private _closeSpeedDial = new BehaviorSubject<boolean | null>(null);
  closeSpeedDial$ = this._closeSpeedDial.asObservable();

  constructor(private dynamicDialog: DialogService,
    private translate: TranslateService
  ) { }

  showSelection(bool: boolean): void {
    this._showSelection.next(bool);
  }

  closeSpeedDial(bool: boolean): void {
    this._closeSpeedDial.next(bool);
  }

  openAddDialog(): void {
    this.ref = this.dynamicDialog.open(AddSiegeComponent, {
      header: this.translate.instant('app.profil.entreprise.sieges.dialog.header'),
      width: '30vw',
      closable: true,
      focusOnShow: false,
      modal: true,
      closeOnEscape: false,
      dismissableMask: false,
    });
  }

  deleteSelection(selectedSieges: Sieges[]) {
    //envoyer une requete au back pour supprimer les trucs
  }

  exportTable(): void{

  }
}
