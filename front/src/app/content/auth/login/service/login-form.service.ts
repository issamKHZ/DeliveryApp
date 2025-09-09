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
      email: form.get("email")?.value,
      password: form.get("password")?.value,
      remember: form.get("remember")?.value
    });
  }

  adaptFormToRecoveryMail(form: UntypedFormGroup) : AuthUser {
    return new AuthUser({
      email: form.get("email")?.value
    })
  }
}
