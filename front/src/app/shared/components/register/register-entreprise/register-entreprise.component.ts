import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RegisterEntrepriseComponent implements OnInit {

  pwdConfError: any;
  passwordVisible: any;
  showRegistration: any;
  showErrors: any;

  form: UntypedFormGroup;
  error: any;

  routeEnum = RoutesEnum;
  villes: String[];

  countries: Country[] = [];
  country?: Country;

  readonly route = '/' + this.routeEnum.AUTH + '/' + this.routeEnum.REGISTER + '/' + this.routeEnum.OPTIONS;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private registerFormService: RegisterFormService) {}


  ngOnInit(): void {    
    this.villes = villesFrance;
    this.countries = countries;
    this.country = this.countries.find(c => c.code == 'FR');
    this.form = this.registerFormService.initEntrepriseForm();    
  }

  toogleToChoices() {
    this.router.navigate([this.route]);
  }

  matchPwd(): boolean {
    return this.form.get("epassword")?.value == this.form.get("epasswordConf")?.value;
  }  

  register() {
    if (this.form.valid) {
      let entreprise = this.registerFormService.adaptFormToModelEntreprise(this.form);            
    } else {
      this.registerFormService.markAllFieldsAsDirty(this.form);
      this.form.markAllAsTouched();
    }
  }

  get passwordControl() {
    return this.form.get('epassword') as FormControl;
  }
}
