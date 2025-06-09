import { Injectable } from '@angular/core';
import { PersonalInfosField, PersonelFieldGroup, PersonelFieldsEnum } from '../../../components/profiles/entreprise/general/general.component';
import { PersonelInfosEntreprise } from '../../../modele/entreprise/PersonelInfosEntreprise';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AdminInfoEntreprise } from '../../../modele/entreprise/AdminInfoEntreprise';
import { secteursList } from '../../../constants/secteurs';

@Injectable({
  providedIn: 'root'
})
export class ProfilEntrepCommonService {

  private _scroll = new BehaviorSubject<any | null>(null);
  scroll$ = this._scroll.asObservable();

  private _showSideBar = new BehaviorSubject<any | null>(null);
  showSideBar$ = this._showSideBar.asObservable();

  constructor(private translate: TranslateService,
    private fb: FormBuilder
  ) { }

  adaptPersonalInfoToForm(infos: PersonelInfosEntreprise): PersonalInfosField[] {
    const fieldConfigs: {
      key: keyof PersonelInfosEntreprise;
      label: string;
      code: PersonelFieldsEnum;
      group: PersonelFieldGroup;
    }[] = [
        { key: 'name', label: this.translate.instant('app.profil.entreprise.general.form.keys.name'), code: PersonelFieldsEnum.NAME, group: PersonelFieldGroup.IDENT },
        { key: 'doc', label: this.translate.instant('app.profil.entreprise.general.form.keys.doc'), code: PersonelFieldsEnum.DOC, group: PersonelFieldGroup.IDENT },
        { key: 'Type', label: this.translate.instant('app.profil.entreprise.general.form.keys.type'), code: PersonelFieldsEnum.TYPE, group: PersonelFieldGroup.IDENT },
        { key: 'mail', label: this.translate.instant('app.profil.entreprise.general.form.keys.mail'), code: PersonelFieldsEnum.MAIL, group: PersonelFieldGroup.CONTACT },
        { key: 'phone', label: this.translate.instant('app.profil.entreprise.general.form.keys.phone'), code: PersonelFieldsEnum.PHONE, group: PersonelFieldGroup.CONTACT },
        { key: 'website', label: this.translate.instant('app.profil.entreprise.general.form.keys.website'), code: PersonelFieldsEnum.WEBSITE, group: PersonelFieldGroup.CONTACT },
      ];

    return fieldConfigs.map(config => {
      const rawValue = infos[config.key];
      const value = typeof rawValue === 'string' && rawValue ? rawValue : ''

      return {
        label: config.label,
        control: new FormControl(value),
        haschanged: false,
        editMode: false,
        focus: false,
        code: config.code,
        originalValue: value,
        firstValue: value,
        group: config.group
      };
    });
  }

  adaptAdministratifInfoToForm(infos: AdminInfoEntreprise): UntypedFormGroup {
    return this.fb.group({
      responsable: [infos.responsableName],
      remail: [infos.responsableEmail],
      rphone: [infos.responsablePhone],
      eadresse: [infos.adress],
      epostal: [infos.postalCode],
      ecity: [infos.city],
      ecountry: [infos.country],
      justificatif: [infos.justificatifDomicil],
      siret: [infos.siretNumber],
      secteur: new FormControl<{ label: string, code: string }[] | null>(this.getSectorsByCodes(infos.activitySector)),
      description: [infos.description]
    }, {
      updateOn: 'submit'
    });
  }

  adaptFormToAdministratifInfo(form: UntypedFormGroup): AdminInfoEntreprise {
    return new AdminInfoEntreprise({
      responsableName: form.get('responsable')?.value,
      responsableEmail: form.get('remail')?.value,
      responsablePhone: form.get('rphone')?.value,
      adress: form.get('eadresse')?.value,
      postalCode: form.get('epostal')?.value,
      city: form.get('ecity')?.value,
      country: form.get('ecountry')?.value,
      siretNumber: form.get('siret')?.value,
      activitySector: form.get('secteur')?.value,
      description: form.get('description')?.value,
      justificatifDomicil: form.get('justificatif')?.value,
    });
  }

  getSectorsByCodes(codes: string[]): { label: string, code: string }[] {
    const secteursConst = secteursList;
    let secteurs = [];

    secteurs = codes.map(code => {
      return {
        label: secteursConst.find(s => s.code == code).label,
        code: code
      }
    })

    return secteurs;
  }

  /**
  * Convertit une string ISO en Date
  * Si invalide ou null, retourne null
  */
  fromISOToDate(isoString: string | null | undefined): Date | null {
    if (!isoString) return null;
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Convertit une Date en string ISO (sans heure, format yyyy-MM-dd)
   * Si null ou invalide, retourne null
   */
  fromDateToISO(date: Date | null | undefined): string | null {
    if (!date) return null;

    if (!(date instanceof Date) || isNaN(date.getTime())) return null;

    // On veut un ISO "yyyy-MM-dd" sans heure
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Format simple dd/MM/yyyy à partir d’une Date pour affichage lisible (optionnel)
   */
  formatDateDDMMYYYY(date: Date | null): string {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  formatStringDDMMYYYY(sDate: string | null): string {
    let date = new Date(sDate);
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  autoScroll(bool: boolean): void {
    this._scroll.next(bool);
  }

  toggleSideBar(bool: boolean): void {
    this._showSideBar.next(bool);
  }

  extractFilenameFromUrl(fileUrl: string | ArrayBuffer): string {
  if (typeof fileUrl === 'string') {
    const match = fileUrl.match(/\/([^\/?#]+)(?:\?|#|$)/);
    return match ? match[1] : null;
  }

  return null;
}

}
