import { CommonModule, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessagesModule } from 'primeng/messages';
import { SelectModule } from 'primeng/select';
import { InputMaskModule } from 'primeng/inputmask';
import { RoutesEnum } from '../../../modele/enumerate/routes';
import { Country } from '../../../modele/Country';
import { countries } from '../../../constants/countries';
import { RegisterFormService } from '../service/register-form.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { vehicles } from '../../../constants/vehicles';
import { CustomPhoneInputComponent } from "../../utils/custom-phone-input/custom-phone-input.component";
import { Subject, takeUntil } from 'rxjs';
import { DigitSpacerLimitedDirective } from '../../../directives/digit-spacer-limited.directive';

@Component({
  selector: 'app-register-livreur',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    CheckboxModule,
    SelectModule,
    TranslateModule,
    MessagesModule,
    RouterModule,
    PasswordModule,
    DividerModule,
    InputMaskModule,
    InputGroupModule,
    InputGroupAddonModule,
    DigitSpacerLimitedDirective
    // CustomPhoneInputComponent
  ],
  templateUrl: './register-livreur.component.html',
  styleUrl: './register-livreur.component.scss'
})
export class RegisterLivreurComponent implements OnInit, OnDestroy {

  vehicles: any[];

  pwdConfError: any;
  passwordVisible: any;
  showRegistration: any;
  showErrors: any;

  displayLoading: boolean;

  form: UntypedFormGroup;
  error: any;

  countries: Country[] = [];
  selectedCountry: Country;
  country?: Country;

  routeEnum = RoutesEnum;

  readonly route = '/' + this.routeEnum.AUTH + '/' + this.routeEnum.REGISTER + '/' + this.routeEnum.OPTIONS;


  constructor(private fb: UntypedFormBuilder,
    private router: Router,
    private registerFormService: RegisterFormService) {

  }


  ngOnInit(): void {
    this.form = this.registerFormService.initLivreurForm();
    this.vehicles = vehicles;

    this.countries = countries;
    this.country = this.countries.find(c => c.code == 'FR');
    this.registerFormService.initIndicatif('MA', this.form.get('indicatif') as UntypedFormControl, this.countries);
    this.selectedCountry = this.form.get('indicatif')?.value;

    this.form.get('lphone')?.valueChanges.subscribe(e => {

    });

  }

  toogleToChoices() {
    this.router.navigate([this.route]);
  }

  onCountryChange(country: Country) {
    this.selectedCountry = country
  }

  matchPwd(): boolean {
    return this.form.get("lpassword")?.value == this.form.get("lpasswordConf")?.value;
  }

  getFormControl(field: string): UntypedFormControl {
    return this.form.get(field) as UntypedFormControl;
  }

  register() {
    if (this.form.valid) {
      let livreur = this.registerFormService.adaptFormToModelLivreur(this.form);
    } else {
      this.registerFormService.markAllFieldsAsDirty(this.form);
      this.form.markAllAsTouched();
    }
  }

  ngOnDestroy() {

  }
}
