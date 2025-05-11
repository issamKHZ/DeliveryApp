import { Injectable } from '@angular/core';
import { FormBuilder, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Country } from '../../../modele/Country';
import { LivreurRegistration } from '../../../modele/livreurRegistration';
import { EntrepriseRegistration } from '../../../modele/entrepriseRegistration';

@Injectable({
  providedIn: 'root'
})
export class RegisterFormService {

  constructor(private fb: FormBuilder) { }

  adaptFormToModelLivreur(form: UntypedFormGroup): LivreurRegistration {
    return new LivreurRegistration({
      name: form.get('lname')?.value,
      lastname: form.get('llastname')?.value,
      email: form.get('lemail')?.value,
      password: form.get('lpassword')?.value,
      vehicle: form.get('lvehicle')?.value,
      age: form.get('lage')?.value,
      phone: form.get('lphone')?.value
    });
  }

  adaptFormToModelEntreprise(form: UntypedFormGroup): EntrepriseRegistration {
    return new EntrepriseRegistration({
      name: form.get('ename')?.value,
      email: form.get('eemail')?.value,
      password: form.get('epassword')?.value,
      adresse: form.get('eadresse')?.value,
      postal: form.get('epostal')?.value,
      ville: form.get('eville')?.value,
      phone: form.get('ephone')?.value
    });
  }

  initEntrepriseForm(): UntypedFormGroup {
    return this.fb.group({
      ename: ['', Validators.required],
      eemail: ['', [Validators.required, Validators.email]],
      epassword: ['', Validators.required],
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
      lemail: ['', [Validators.required, Validators.email]],
      lpassword: ['', Validators.required],
      lpasswordConf: ['', Validators.required],
      lvehicle: ['', Validators.required],
      lage: [18, Validators.required],
      lphone: [null, Validators.required]
    }, {
        updateOn: 'submit'
      }
    );
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

  initIndicatif(code: string, formControl: UntypedFormControl, countries: Country[]): void {
    formControl?.setValue(countries.find((country) => country.code == code));
  }
}
