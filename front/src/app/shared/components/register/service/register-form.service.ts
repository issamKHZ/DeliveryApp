import { Injectable } from '@angular/core';
import { FormBuilder, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Country } from '../../../modele/Country';
import { RegistrationInfos } from '../../../modele/RegistrationInfos';
import { UserRoles } from '../../../modele/enumerate/userRoles';
import { complexityPasswordValidator, customEmailValidator, minLengthPasswordValidator } from '../../../utils/validators';

@Injectable({
  providedIn: 'root'
})
export class RegisterFormService {

  constructor(private fb: FormBuilder) { }

  adaptFormToModelLivreur(form: UntypedFormGroup, country: Country): RegistrationInfos {
    return new RegistrationInfos({
      user: {
        name: form.get('lname')?.value + form.get('llastname')?.value,
        email: form.get('lemail')?.value,
        password: form.get('lpassword')?.value,
        phoneNumber: country?.indicatif + ' ' + form.get('lphone')?.value,
        role: UserRoles.LIVREUR
      },
      entreprise: null,
      livreur: {
        firstName: form.get('lname')?.value,
        lastName: form.get('llastname')?.value,
        age: form.get('lage')?.value,
        vehicleType: form.get('lvehicle')?.value.code,
      }
    });
  }

  adaptFormToModelEntreprise(form: UntypedFormGroup, country: Country): RegistrationInfos {
    console.log(country);    
    return new RegistrationInfos({
      user: {
        name: form.get('ename')?.value,
        email: form.get('eemail')?.value,
        password: form.get('epassword')?.value,
        phoneNumber: country?.indicatif + ' ' + form.get('ephone')?.value,
        role: UserRoles.ENTREPRISE
      },
      entreprise: {
        address: form.get('eadresse')?.value,
        postalCode: form.get('epostal')?.value,
        city: form.get('eville')?.value,
      },
      livreur: null
    });
  }

  initEntrepriseForm(): UntypedFormGroup {
    return this.fb.group({
      ename: ['', Validators.required],
      eemail: ['', [Validators.required, customEmailValidator]],
      epassword: ['', [Validators.required, minLengthPasswordValidator,
        complexityPasswordValidator]],
      epasswordConf: ['', Validators.required],
      eadresse: ['', Validators.required],
      epostal: [null, Validators.required],
      eville: ['', Validators.required],
      ephone: ['', Validators.required],
    }, {
      updateOn: 'submit'
    });
  }

  initLivreurForm(): UntypedFormGroup {
    return this.fb.group({
      lname: ['', Validators.required],
      llastname: ['', Validators.required],
      lemail: ['', [Validators.required, customEmailValidator]],
      lpassword: ['', [Validators.required , minLengthPasswordValidator,
        complexityPasswordValidator]],
      lpasswordConf: ['', Validators.required],
      lvehicle: ['', Validators.required],
      lage: [18, Validators.required],
      lphone: [null, Validators.required]
    }, {
      updateOn: 'submit'
    }
    );
  }  

  initIndicatif(code: string, formControl: UntypedFormControl, countries: Country[]): void {
    formControl?.setValue(countries.find((country) => country.code == code));
  }
}
