import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { AuthUser } from '../../../../shared/modele/AuthUser';

@Injectable({
  providedIn: 'root'
})
export class LoginFormService {

  constructor() { }

  adaptFormToAuthUser(form: UntypedFormGroup) : AuthUser{
    return new AuthUser ({      
      mail: form.get("email")?.value,
      mdp: form.get("password")?.value
    });
  }

  adaptFormToRecoveryMail(form: UntypedFormGroup) : AuthUser {
    return new AuthUser({
      mail: form.get("email")?.value
    })
  }
}
