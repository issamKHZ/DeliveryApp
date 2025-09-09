import { Injectable } from '@angular/core';
import { RoutesEnum } from '../../modele/enumerate/routes';
import { UntypedFormGroup, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { StatusCode } from '../profile/entreprise/pEntrepCommon.service';
import { TagSeverity } from '../../components/utils/custom-tag/custom-tag.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private _accountID = new BehaviorSubject<string | null>(null);
  accountID$ = this._accountID.asObservable();
  
  constructor() { }

  composeRoute(routes: RoutesEnum[]): string {
    let route = '';

    for (let i = 0; i < routes.length; i++) {
      route += '/' + routes[i];
    }

    return route;
  }

  setAccountID(id: string): void {
    this._accountID.next(id);
  }

  parseJsonString(string: string): any {
    try {
      const parsed = JSON.parse(string);
      return parsed;
    } catch (e) {
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

  findScrollableParent(element: HTMLElement): HTMLElement | Window {
    let current = element.parentElement;

    while (current) {
      const style = window.getComputedStyle(current);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        return current;
      }
      current = current.parentElement;
    }

    return window;
  }

  hasRequiredError(form: UntypedFormGroup): boolean {
    return Object.keys(form.controls).some(key => {
      const control = form.get(key);
      return control?.errors?.['required'] && control.touched;
    });
  }

  getContextByCode(code: string): StatusCode {
    const statusMap: Record<string, StatusCode> = {
      'RESERVED': StatusCode.RESERVED,
      'DISPONIBLE': StatusCode.DISPONIBLE,
      'EN_LIVRAISON': StatusCode.EN_LIVRAISON,
      'BLOQUE': StatusCode.BLOQUE,
      'INACTIF': StatusCode.INACTIF,
      'SUSPENDU': StatusCode.SUSPENDU,
      'ACTIF': StatusCode.ACTIF,
      'EN_ATTENTE_VALIDATION': StatusCode.EN_ATTENTE_VALIDATION
    };

    return statusMap[code] || StatusCode.INACTIF; // Valeur par défaut
  }

  getSeverityByCode(code: any): TagSeverity {
    if (typeof code === 'number' && Object.values(TagSeverity).includes(code)) {
      return code;
    }

    const statusMap: Record<string, TagSeverity> = {
      'SUCCESS': TagSeverity.SUCCESS,
      'INFO': TagSeverity.INFO,
      'WARN': TagSeverity.WARN,
      'DANGER': TagSeverity.DANGER,
    };

    if (code in statusMap) {
      return statusMap[code];
    }

    return TagSeverity.INFO;
  }

  public capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  getInitials(name: string): string {
    if (name) {
      const words = name.trim().split(/\s+/);

      if (words.length >= 2) {
        return words[0][0].toUpperCase() + words[1][0].toUpperCase();
      } else if (words.length === 1 && words[0].length >= 2) {
        return words[0].substring(0, 2).toUpperCase();
      }
    }

    return "";
  }



}
