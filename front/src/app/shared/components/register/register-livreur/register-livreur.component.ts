import { CommonModule, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
import { DigitSpacerLimitedDirective } from '../../../directives/digit-spacer-limited.directive';
import { RegisterLivreurService } from '../../../services/register-livreur.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { MessageService } from 'primeng/api';
import { CommonService } from '../../../utils/common.service';
import { LoadingService } from '../../utils/spinner/loading.service';
import { HttpStatusCode } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

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
    DigitSpacerLimitedDirective,    
    // CustomPhoneInputComponent
  ],
  templateUrl: './register-livreur.component.html',
  styleUrl: './register-livreur.component.scss',
  animations: [
      trigger('fadeInOut', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('1000ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
    ]
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

  optionsRoute: string;
  emailValidationRoute: string;


  constructor(private fb: UntypedFormBuilder,
    private router: Router,
    private registerFormService: RegisterFormService,
    private registerService: RegisterLivreurService,
    private translate: TranslateService,
    private message: MessageService,
    private commonService: CommonService,
    private spinner: LoadingService,
    private auth: AuthService
  ) {
    this.optionsRoute = this.commonService.composeRoute([this.routeEnum.AUTH, this.routeEnum.REGISTER, this.routeEnum.OPTIONS]);
    this.emailValidationRoute = this.commonService.composeRoute([this.routeEnum.VALIDATION, this.routeEnum.MAIL]);
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
    this.router.navigate([this.optionsRoute]);
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
    if (this.form.valid && this.matchPwd()) {
      this.spinner.show();
      let livreur = this.registerFormService.adaptFormToModelLivreur(this.form, this.country);
      this.registerService.register(livreur).subscribe({
        next: (response) => {
          console.log(response);
          
          this.auth.saveMail(response.email);
          this.router.navigate([this.emailValidationRoute]);
          this.spinner.hide();
          this.message.add({
            severity: 'info', summary: this.translate.instant('app.auth.register.register-entreprise.messages.info.summary'),
            detail: this.translate.instant('app.auth.register.register-entreprise.messages.info.detail'), life: 5000
          });
        },
        error: (error) => {                       
          this.spinner.hide();
          if (error.status == HttpStatusCode.Conflict && error.error == "Email") {
            this.message.add({
              severity: 'error', summary: this.translate.instant('app.auth.register.register-entreprise.messages.email-error.summary'),
              detail: this.translate.instant('app.auth.register.register-entreprise.messages.email-error.detail'), life: 5000
            });
          } else if (error.status == HttpStatusCode.Conflict && error.error == "PhoneNumber") {
            this.message.add({
              severity: 'error', summary: this.translate.instant('app.auth.register.register-entreprise.messages.phone-error.summary'),
              detail: this.translate.instant('app.auth.register.register-entreprise.messages.phone-error.detail'), life: 5000
            });
          }
        }
      });
    } else {
      this.commonService.markAllFieldsAsDirty(this.form);
      this.form.markAllAsTouched();
    }
  }

  ngOnDestroy() {

  }
}
