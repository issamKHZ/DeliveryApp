import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddSiegeComponent } from '../../../../components/dialogs/add-siege/add-siege.component';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Sieges } from '../../../../modele/entreprise/Sieges';
import { UntypedFormGroup } from '@angular/forms';
import { SiegeHttpService } from './siege.http.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SitesExcelService } from './sites.excel.service';
import { CollectionItem } from '../../../../modele/CollectionItem';

@Injectable({
  providedIn: 'root'
})
export class SiegeService {


  ref: DynamicDialogRef;

  private _showSelection = new BehaviorSubject<boolean | null>(null);
  showSelection$ = this._showSelection.asObservable();

  private _closeSpeedDial = new BehaviorSubject<boolean | null>(null);
  closeSpeedDial$ = this._closeSpeedDial.asObservable();

  private _deletedIds = new BehaviorSubject<number[] | null>(null);
  deletedIds$ = this._deletedIds.asObservable();

  constructor(private dynamicDialog: DialogService,
    private translate: TranslateService,
    private siegeService: SiegeHttpService,
    private confirmationService: ConfirmationService,
    private message: MessageService,
    private excelService: SitesExcelService
  ) { }

  showSelection(bool: boolean): void {
    this._showSelection.next(bool);
  }

  closeSpeedDial(bool: boolean): void {
    this._closeSpeedDial.next(bool);
  }

  openAddDialog(id: string): void {
    this.ref = this.dynamicDialog.open(AddSiegeComponent, {
      header: this.translate.instant('app.profil.entreprise.sieges.dialog.header'),
      data: {
        entrepriseID: id
      },
      width: '30vw',
      closable: true,
      focusOnShow: false,
      modal: true,
      closeOnEscape: false,
      dismissableMask: false,
    });
  }

  deleteSelection(selectedSieges: Sieges[]) {
    let ids = selectedSieges.map(s => s.id);
    if (ids && ids.length != 0) {
      this.showCloseConfirmation(ids);
    } else {
      this.message.add({
        severity: 'warn', summary: this.translate.instant('app.profil.entreprise.sieges.errors.choose-sites.summary'),
        detail: this.translate.instant('app.profil.entreprise.sieges.errors.choose-sites.detail'), life: 4000
      });
    }


  }

  private showCloseConfirmation(ids: number[]): void {
    this.confirmationService.confirm({
      message: this.translate.instant('app.profil.entreprise.sieges.confirmDialog.message'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onReject();
      },
      reject: () => {
        this.onAccept(ids);
      },
      acceptLabel: this.translate.instant('app.common.buttons-label.cancel'),
      rejectLabel: this.translate.instant('app.common.buttons-label.yes'),
      acceptButtonStyleClass: 'cold-button',
      rejectButtonStyleClass: 'p-button-danger',
      closeOnEscape: true,
      dismissableMask: true,
      key: 'deleteConfirmation'
    });
  }
  onAccept(ids: number[]) {
    this.siegeService.deleteSites(ids).subscribe({
      next: (response) => {
        this._deletedIds.next(response);
      },
      error: () => {
        this.message.add({
          severity: 'error', summary: this.translate.instant('app.profil.entreprise.sieges.errors.error.summary'),
          detail: this.translate.instant('app.profil.entreprise.sieges.errors.error.detail'), life: 4000
        });
      }
    });
  }
  onReject() {
    console.log()
  }

  exportToExcel(dt1: Table, types: any[], dispos: any[]) {
    try {
      this.excelService.exportTableToExcel(
        dt1,
        this.translate.instant('app.profil.entreprise.sieges.export.filename'),
        types,
        dispos
      );
      this.message.add({
        severity: 'success',
        summary: this.translate.instant('app.profil.entreprise.sieges.export.success.summary'),
        detail: this.translate.instant('app.profil.entreprise.sieges.export.success.detail'),
        life: 3000
      });
    } catch (error) {
      this.message.add({
        severity: 'error',
        summary: this.translate.instant('app.profil.entreprise.sieges.export.error.summary'),
        detail: this.translate.instant('app.profil.entreprise.sieges.export.error.detail'),
        life: 5000
      });
    }
  }

  adaptAddingFormToModel(form: UntypedFormGroup, id: string): Sieges {
    return new Sieges({
      typeCode: form.get("type")?.value,
      adresse: form.get("adresse")?.value,
      city: form.get("country")?.value,
      dispoCode: form.get("dispo")?.value,
      email: form.get("email")?.value,
      phone: form.get("phone")?.value,
      isDest: form.get("dest")?.value,
      entrepriseId: id
    });
  }

  adaptCitiesOptions(data: { code: string, city: string, countryCode: string }[]): CollectionItem[] {
    let trad: Record<string, string> = {
      "Morocco": this.translate.instant('app.profil.entreprise.sieges.dialog.cities.morocco')
    };
    let result = data.map(i => {
      return {
        code: i.code,
        label: i.city + ", " + trad[i.countryCode]
      }
    });
    return result;
  }

  getLocation(siege: Sieges): string {
    let trad: Record<string, string> = {
      "Morocco": this.translate.instant('app.profil.entreprise.sieges.dialog.cities.morocco')
    };
    return siege.city + ", " + trad[siege.country];
  }

  getPartialLocation(city: string, country: string): string {
    let trad: Record<string, string> = {
      "Morocco": this.translate.instant('app.profil.entreprise.sieges.dialog.cities.morocco')
    };
    return city + ", " + trad[country];
  }

  getDestIcon(dest: boolean): string {
    return dest ? 'pi-truck text-blue-500' : 'pi-box text-orange-500';
  }
}
