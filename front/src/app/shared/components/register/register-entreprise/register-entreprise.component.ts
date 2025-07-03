import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { RoutesEnum } from '../../../modele/enumerate/routes';
import { animate, style, transition, trigger } from '@angular/animations';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider'
import { SelectModule } from 'primeng/select';
import { countries, villesFrance } from '../../../constants/countries';
import { RegisterFormService } from '../service/register-form.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { TooltipModule } from 'primeng/tooltip';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Country } from '../../../modele/Country';
import { DigitSpacerLimitedDirective } from '../../../directives/digit-spacer-limited.directive';
import { RegisterEntrepriseService } from '../../../services/register-entreprise.service';
import { MessageService } from 'primeng/api';
import { CommonService } from '../../../utils/common.service';
import { HttpStatusCode } from '@angular/common/http';
import { LoadingService } from '../../utils/spinner/loading.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-entreprise',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    TranslateModule,
    MessagesModule,
    RouterModule,
    PasswordModule,
    SelectModule,
    DividerModule,
    InputNumberModule,
    InputGroupModule,
    InputGroupAddonModule,
    TooltipModule,
    DigitSpacerLimitedDirective
  ],
  templateUrl: './register-entreprise.component.html',
  styleUrl: './register-entreprise.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('1000ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
})
export class RegisterEntrepriseComponent implements OnInit {

  pwdConfError: any;
  passwordVisible: any;
  showRegistration: any;
  showErrors: any;

  form: UntypedFormGroup;
  error: any;

  routes = RoutesEnum;
  villes: String[];

  countries: Country[] = [];
  country?: Country;

  optionsRoute: string;
  emailValidationRoute: string;


  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private registerFormService: RegisterFormService,
    private registerEntrepriseService: RegisterEntrepriseService,
    private message: MessageService,
    private translate: TranslateService,
    private commonService: CommonService,
    private spinner: LoadingService,
    private auth: AuthService
  ) {
    this.optionsRoute = this.commonService.composeRoute([this.routes.AUTH, this.routes.REGISTER, this.routes.OPTIONS]);
    this.emailValidationRoute = this.commonService.composeRoute([this.routes.VALIDATION, this.routes.MAIL]);
  }


  ngOnInit(): void {
    this.villes = villesFrance;
    this.countries = countries;
    this.country = this.countries.find(c => c.code == 'FR');
    this.form = this.registerFormService.initEntrepriseForm();
  }

  toogleToChoices() {
    this.router.navigate([this.optionsRoute]);
  }

  matchPwd(): boolean {
    return this.form.get("epassword")?.value == this.form.get("epasswordConf")?.value;
  }

  register() {
    if (this.form.valid && this.matchPwd()) {
      this.spinner.show();
      let entreprise = this.registerFormService.adaptFormToModelEntreprise(this.form, this.country);
      this.registerEntrepriseService.register(entreprise).subscribe({
        next: (response) => {
          this.auth.saveMail(response.email);
          this.router.navigate([this.emailValidationRoute]);
          this.spinner.hide();
          this.message.add({
            severity: 'info', summary: this.translate.instant('app.auth.register.register-entreprise.messages.info.summary'),
            detail: this.translate.instant('app.auth.register.register-entreprise.messages.info.detail'), life: 5000
          });
        },
        error: (error) => {   
          const errorParsed = this.commonService.parseJsonString(error.message);                    
          this.spinner.hide();
          if (errorParsed.status == HttpStatusCode.Conflict && errorParsed.error == "Email") {
            this.message.add({
              severity: 'error', summary: this.translate.instant('app.auth.register.register-entreprise.messages.email-error.summary'),
              detail: this.translate.instant('app.auth.register.register-entreprise.messages.email-error.detail'), life: 5000
            });
          } else if (errorParsed.status == HttpStatusCode.Conflict && errorParsed.error == "PhoneNumber") {
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

  get passwordControl() {
    return this.form.get('epassword') as FormControl;
  }
}
