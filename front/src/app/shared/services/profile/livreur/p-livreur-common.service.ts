import { Injectable, SecurityContext } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { InfosLivreur } from '../../../modele/livreur/Info-Livreur';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import { ProfilEntrepCommonService } from '../entreprise/pEntrepCommon.service';
import { ScheduleLine } from '../../../modele/scheduleLine';
import { Days } from '../../../modele/enumerate/Days';
import { CommonService } from '../../utils/common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { AdminInfoEntreprise } from '../../../modele/entreprise/AdminInfoEntreprise';
import { horaireValidator, ribValidator } from '../../../utils/validators';

@Injectable({
  providedIn: 'root'
})
export class PLivreurCommonService {

  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  constructor(
    private fb: FormBuilder,
    private entrepService: ProfilEntrepCommonService,
    private commonService: CommonService,
    private sanitizer: DomSanitizer,
  ) { }

  // adaptGeneralDtoToModel(data: any): InfosLivreur {
  //   return new InfosLivreur({
  //     name: data.name,
  //     lastname: data.lastname,
  //     age: data.age,
  //     immatricule: data.id,
  //     livMail: data.email,
  //     livPhone: data.phone,
  //     livAdresse: data.adresse,
  //     ville: data.city,
  //     codePostal: data.postal,
  //     country: data.country,
  //     dateInscription: format(new Date(data.creationDate), 'dd/MM/yyyy', { locale: fr }),
  //     status: { severity: this.entrepService.getSeverityByCode(data.status.severity), content: this.entrepService.getContextByCode(data.status.code) }
  //   })
  // }

  private profileData$ = new BehaviorSubject<any | null>(null);

  setProfileData(data: any) {
    this.profileData$.next(data);
  }

  getProfileData() {
    return this.profileData$.asObservable();
  }

  adaptPersoInfoToForm(infos: InfosLivreur): UntypedFormGroup {
    return this.fb.group({
      img: [null], // TODO : A refaire
      name: [infos?.name],
      lastname: [infos?.lastname],
      age: [infos?.age],
      // rib: [infos?.rib, ribValidator],
      immatricule: [infos?.id],
      dateInscription: [format(new Date(infos?.creationDate), 'dd/MM/yyyy', { locale: fr })],
      langue: [infos?.langues],
      // horaire: [infos?.horaire],
      livMail: [infos?.email],
      livPhone: [infos?.phone],
      livAdresse: [infos?.adresse],
      ville: [infos?.city],
      codePostal: [infos?.postal],
      vType: [infos?.typeVehicle],
      vmatricule: [infos?.matricule],
      vmodele: [infos?.modele],
      vImg: [null], // TODO : A refaire
      permis: [null], // TODO : A refaire
      assurance: [null], // TODO : A refaire
    })
  }

  adaptFormToPersonal(form: UntypedFormGroup, profilImg: File, vehicleImg: File, assurance: File, permis: File, horaires: ScheduleLine[]): FormData {
    const formData = new FormData();

    formData.append('id', form.get("immatricule")?.value || '');
    formData.append('name', form.get("name")?.value || '');
    formData.append('lastname', form.get("lastname")?.value || '');
    formData.append('age', form.get("age")?.value || '');
    // formData.append('rib', form.get("rib")?.value || '');
    formData.append('phone', form.get("livPhone")?.value || '');
    formData.append('adresse', form.get("livAdresse")?.value || '');
    formData.append('city', form.get("ville")?.value || '');
    formData.append('postal', form.get("codePostal")?.value || '');
    formData.append('typeVehicle', form.get("vType")?.value || '');
    formData.append('matricule', form.get("vmatricule")?.value || '');
    formData.append('modele', form.get("vmodele")?.value || '');

    const langues = form.get("langue")?.value || [];
    langues.forEach((l: any, index: number) => {
      formData.append(`langues[${index}]`, l);
    });

    if (profilImg) {
      formData.append('profilImg', profilImg)
    }

    if (vehicleImg) {
      formData.append('vehicleImg', vehicleImg)
    }

    if (assurance) {
      formData.append('assurance', assurance)
    }

    if (permis) {
      formData.append('permis', permis)
    }

   if (horaires) {
      horaires.forEach((h: ScheduleLine, index: number) => {
        formData.append(`horaires[${index}].Day`, h.day.toString());
        if (h.startHour) {
          formData.append(`horaires[${index}].StartHour`, h.startHour);
        }
        if (h.endHour) {
          formData.append(`horaires[${index}].EndHour`, h.endHour);
        }
        if (h.dispo !== undefined) {
          formData.append(`horaires[${index}].Dispo`, h.dispo.toString());
        }
      });
    }

    return formData;
  }


  adaptScheduleToForm(schedule: ScheduleLine[]): UntypedFormGroup {
    return this.fb.group({
      disponibility: [null],
      days: this.fb.group(
        schedule.reduce((daysGroup, line) => ({
          ...daysGroup,
          [line.day]: this.fb.group({
            start: [line.startHour ? new Date(line.startHour) : null],
            end: [line.endHour ? new Date(line.endHour) : null],
            indispo: [!line.dispo]
          }, { validators: [horaireValidator] })
        }), {})
      )
    });
  }

  private parseTimeStringToDate(timeString: string): Date | null {
    if (!timeString || timeString == "") return null;

    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  public convertFormToScheduleLines(form: UntypedFormGroup): ScheduleLine[] {
    const daysGroup = form.get('days')?.value;
    return Object.keys(daysGroup).map(day => ({
      day: day as Days,
      startHour: daysGroup[day].start ? (daysGroup[day].start).toISOString() : null,
      endHour: daysGroup[day].end ? (daysGroup[day].end).toISOString() : null,
      dispo: !daysGroup[day].indispo
    }));
  }

  private formatDateToTime(date: Date): string {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  public initSchedule(): ScheduleLine[] {
    return Object.values(Days)
      .filter((d): d is Days => typeof d === 'string')
      .map((day): ScheduleLine => ({
        day,
        startHour: null,
        endHour: null,
        dispo: true
      }));
  }
}
