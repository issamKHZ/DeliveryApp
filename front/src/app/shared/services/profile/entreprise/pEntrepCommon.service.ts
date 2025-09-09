import { Injectable, SecurityContext } from '@angular/core';
import { PersonalInfosField, PersonelFieldGroup, PersonelFieldsEnum } from '../../../components/profiles/entreprise/general/general.component';
import { PersonalInfosGeneralDto, PersonelInfosEntreprise } from '../../../modele/entreprise/PersonelInfosEntreprise';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AdminInfoEntreprise } from '../../../modele/entreprise/AdminInfoEntreprise';
import { secteursList } from '../../../constants/entrepConstants';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TagSeverity } from '../../../components/utils/custom-tag/custom-tag.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonService } from '../../utils/common.service';
import { ProfileEntrepriseService } from './profile-entreprise.service';
import { FilesService } from '../../utils/files.service';

export enum StatusCode {
  RESERVED = "Reservé",
  DISPONIBLE = "Disponible",
  EN_LIVRAISON = "En mission",
  BLOQUE = "Compte bloqué",
  INACTIF = "Inactif",
  SUSPENDU = "Compte suspendu",
  ACTIF = "Compte actif",
  EN_ATTENTE_VALIDATION = "En cours de validation"
}

@Injectable({
  providedIn: 'root'
})
export class ProfilEntrepCommonService {  


  private _scroll = new BehaviorSubject<any | null>(null);
  scroll$ = this._scroll.asObservable();

  private _showSideBar = new BehaviorSubject<any | null>(null);
  showSideBar$ = this._showSideBar.asObservable();

  private profileData$ = new BehaviorSubject<AdminInfoEntreprise | null>(null);
  private entrepName$ = new BehaviorSubject<string | null>(null);

  setEntrepName(data: string) {
    this.entrepName$.next(data);
  }

  getEntrepName() {
    return this.entrepName$.asObservable();
  }

  setProfileData(data: AdminInfoEntreprise) {
    this.profileData$.next(data);
  }

  getProfileData() {
    return this.profileData$.asObservable();
  }

  constructor(
    private translate: TranslateService,
    private commonService: CommonService,
    private profileService: ProfileEntrepriseService,
    private fb: FormBuilder,
    private fileService: FilesService
  ) { }

  adaptGeneralDtoToModel(data: any): PersonelInfosEntreprise {        
    return new PersonelInfosEntreprise({
      ID: data.id,
      name: data.name,
      Type: 'Entreprise',
      mail: data.email,
      phone: data.phone,
      web: data.web,
      doc: format(new Date(data.creationDate), 'dd/MM/yyyy', { locale: fr }),
      status: { severity: this.commonService.getSeverityByCode(data.status.severity), content: this.commonService.getContextByCode(data.status.code) },
      imageResult: data.imageResult ? { fileContents: data.imageResult.fileContents, contentType: data.imageResult.contentType } : null,
      img: data.imageResult ? this.fileService.createImageUrl(data.imageResult.fileContents, data.imageResult.contentType) : null
    })
  }

  adaptPersonalInfoToForm(infos: PersonelInfosEntreprise): PersonalInfosField[] {
    const fieldConfigs: {
      key: keyof PersonelInfosEntreprise;
      label: string;
      placeholder?: string;
      code: PersonelFieldsEnum;
      group: PersonelFieldGroup;
    }[] = [
        {
          key: 'name',
          label: this.translate.instant('app.profil.entreprise.general.form.keys.name'),
          placeholder: this.translate.instant('app.profil.entreprise.general.form.placeholders.name'),
          code: PersonelFieldsEnum.NAME, group: PersonelFieldGroup.IDENT
        },
        {
          key: 'doc',
          label: this.translate.instant('app.profil.entreprise.general.form.keys.doc'),
          code: PersonelFieldsEnum.DOC, group: PersonelFieldGroup.IDENT
        },
        {
          key: 'Type',
          label: this.translate.instant('app.profil.entreprise.general.form.keys.type'),
          code: PersonelFieldsEnum.TYPE, group: PersonelFieldGroup.IDENT
        },
        {
          key: 'mail',
          label: this.translate.instant('app.profil.entreprise.general.form.keys.mail'),
          placeholder: this.translate.instant('app.profil.entreprise.general.form.placeholders.mail'),
          code: PersonelFieldsEnum.MAIL, group: PersonelFieldGroup.CONTACT
        },
        {
          key: 'phone',
          label: this.translate.instant('app.profil.entreprise.general.form.keys.phone'),
          placeholder: this.translate.instant('app.profil.entreprise.general.form.placeholders.phone'),
          code: PersonelFieldsEnum.PHONE, group: PersonelFieldGroup.CONTACT
        },
        {
          key: 'web',
          label: this.translate.instant('app.profil.entreprise.general.form.keys.website'),
          placeholder: this.translate.instant('app.profil.entreprise.general.form.placeholders.website'),
          code: PersonelFieldsEnum.WEBSITE, group: PersonelFieldGroup.CONTACT
        },
      ];

    return fieldConfigs.map(config => {
      const rawValue = infos[config.key];
      const value = typeof rawValue === 'string' && rawValue ? rawValue : ''

      return {
        label: config.label,
        control: new FormControl(value),
        haschanged: false,
        editMode: false,
        placeholder: config.placeholder,
        focus: false,
        code: config.code,
        originalValue: value,
        firstValue: value,
        group: config.group
      };
    });
  }

  adaptGeneralFieldsToModel(fields: PersonalInfosField[], id: string, file: File): FormData {
    const dataFile = new FormData();

    dataFile.append('ID', id);
    dataFile.append('Name', fields.find(f => f.code == PersonelFieldsEnum.NAME).control.value);
    dataFile.append('Email', fields.find(f => f.code == PersonelFieldsEnum.MAIL).control.value);
    dataFile.append('Phone', fields.find(f => f.code == PersonelFieldsEnum.PHONE).control.value);
    dataFile.append('Web', fields.find(f => f.code == PersonelFieldsEnum.WEBSITE).control.value);

    // Ajoutez le fichier s'il existe
    if (file) {
      dataFile.append('Image', file);
    }

    return dataFile;
  }

  adaptAdminDtoToModel(data: any): AdminInfoEntreprise {
    return new AdminInfoEntreprise({
      iD: data.id,
      responsableName: data.responsable ? data.responsable.name + " " + data.responsable.lastname : null,
      responsableEmail: data.responsable ? data.responsable.email : null,
      responsablePhone: data.responsable ? data.responsable.phone : null,
      adresse: data.adresse,
      postalCode: data.postal,
      city: data.city,
      country: data.country,
      siretNumber: data.siret,
      activitySector: data.activitySector,
      description: data.livraisonNotice,
      justificatifDomicil: data.domicileResult ? this.fileService.createFileUrl(data.domicileResult.fileContents, data.domicileResult.contentType) : null,
      fileDownloadName: data.domicileResult ? data.domicileResult.fileDownloadName : null
    })
  }

  adaptAdministratifInfoToForm(infos: AdminInfoEntreprise): UntypedFormGroup {
    return this.fb.group({
      responsable: [infos?.responsableName],
      remail: [infos?.responsableEmail],
      rphone: [infos?.responsablePhone],
      eadresse: [infos?.adresse],
      epostal: [infos?.postalCode],
      ecity: [infos?.city],
      ecountry: [infos?.country],
      justificatif: [infos?.justificatifDomicil],
      siret: [infos?.siretNumber],
      secteur: [infos.activitySector],
      description: [infos?.description]
    }, {
      updateOn: 'submit'
    });
  }

  adaptFormToAdministratifInfo(form: UntypedFormGroup, id: string, file: File): FormData {
    const formData = new FormData();

    // Fonction helper pour nettoyer les valeurs
    const cleanValue = (value: any) => {
      if (value === null || value === undefined || value === 'null' || value === '') {
        return null;
      }
      return value;
    };

    // Ajout des champs simples avec nettoyage
    formData.append('iD', id);
    formData.append('responsableName', cleanValue(form.get('responsable')?.value) ?? '');
    formData.append('responsableEmail', cleanValue(form.get('remail')?.value) ?? '');
    formData.append('responsablePhone', cleanValue(form.get('rphone')?.value) ?? '');
    formData.append('adresse', cleanValue(form.get('eadresse')?.value) ?? '');
    formData.append('postalCode', cleanValue(form.get('epostal')?.value) ?? '');
    formData.append('city', cleanValue(form.get('ecity')?.value) ?? '');
    formData.append('country', cleanValue(form.get('ecountry')?.value) ?? '');
    formData.append('siretNumber', cleanValue(form.get('siret')?.value) ?? '');

    const secteurValue = form.get('secteur')?.value;
    if (secteurValue && Array.isArray(secteurValue)) {
      secteurValue.forEach((val, index) => {
        formData.append(`activitySector[${index}]`, val);
      });
    } else {
      formData.append('activitySector', ''); 
    }

    formData.append('description', cleanValue(form.get('description')?.value) ?? '');

    // Ajout du fichier
    if (file) {
      formData.append('domicileFile', file, file.name);
    }

    return formData;
  }

  // getSectorsByCodes(codes: string[]): { label: string, code: string }[] {    

  //   const secteursConst = secteursList;
  //   let secteurs = [];

  //   if (!codes) return [];

  //   secteurs = codes.map(code => {
  //     return {
  //       label: secteursConst.find(s => s.code == code).label,
  //       code: code
  //     }
  //   })

  //   return secteurs;
  // }

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

  areRequiredFieldsFilled(form: FormGroup, requiredFields: string[]): boolean {
    return requiredFields.every(fieldName => {
      const control = form.get(fieldName);
      if (!control) return false;
      const value = control.value;
      return value !== null && value !== undefined && value.toString().trim() !== '';
    });
  }  

}



