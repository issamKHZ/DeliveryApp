import { Injectable } from '@angular/core';
import { RoutesEnum } from '../modele/enumerate/routes';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  composeRoute(routes: RoutesEnum[]): string {
    let route = '';

    for (let i = 0; i < routes.length; i++) {
      route += '/' + routes[i];
    }

    return route;
  }

  parseJsonString(string: string): any {
    try {
      const parsed = JSON.parse(string);
      return parsed;
    } catch (e) {
      console.log('Erreur lors du parsing de error.message:', e);
    }
  }

  markAllFieldsAsDirty(formGroup: UntypedFormGroup | UntypedFormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
        this.markAllFieldsAsDirty(control);
      }
    });
  }

}
