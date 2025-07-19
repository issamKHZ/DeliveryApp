import { Injectable } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
import { InfosLivreur } from '../../../modele/livreur/Info-Livreur';

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

  constructor(private fb: FormBuilder) { }

  adaptPersoInfoToForm(infos: InfosLivreur): UntypedFormGroup {
    return this.fb.group({
      img: [infos?.img],
      name: [infos?.name],
      lastname: [infos?.lastname],
      immatricule: [infos?.immatricule],
      dateInscription: [new Intl.DateTimeFormat('fr-FR', this.options).format(infos?.dateInscription)],
      langue: [infos?.langue],
      // horaire: [infos?.horaire],
      livMail: [infos?.livMail],
      livPhone: [infos?.livPhone],
      livAdresse: [infos?.livAdresse],
      ville: [infos?.ville],
      codePostal: [infos?.codePostal],
      vType: [infos?.vType],
      vmatricule: [infos?.vmatricule],
      vmodele: [infos?.vmodele],
      vImg: [infos?.vImg],
      permis: [infos?.permis],
      assurance: [infos?.assurance],
    })
  }
}
