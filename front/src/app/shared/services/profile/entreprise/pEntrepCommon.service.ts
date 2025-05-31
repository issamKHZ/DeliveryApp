import { Injectable } from '@angular/core';
import { PersonalInfosField, PersonelFieldGroup, PersonelFieldsEnum } from '../../../components/profiles/entreprise/general/general.component';
import { PersonelInfosEntreprise } from '../../../modele/entreprise/PersonelInfosEntreprise';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProfilEntrepCommonService {

  constructor(private translate: TranslateService) { }

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
}
