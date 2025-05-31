import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { MessagesModule } from 'primeng/messages';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Style } from '../../../shared/constants/styles';
import { complexityPasswordValidator, customEmailValidator, minLengthPasswordValidator } from '../../../shared/utils/validators';
import { RoutesEnum } from '../../../shared/modele/enumerate/routes';
import { LoginFormService } from './service/login-form.service';
import { AuthService } from '../../../shared/services/auth.service';
import { SubscriptionManager } from '../../../shared/utils/subscription-manager';
import { LoadingService } from '../../../shared/components/utils/spinner/loading.service';
import { RegisterFormService } from '../../../shared/components/register/service/register-form.service';
import { CommonService } from '../../../shared/utils/common.service';
import { LoginService } from '../../../shared/services/login.service';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    TranslateModule,
    RouterModule,
    MessagesModule,
    FloatLabelModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent extends SubscriptionManager implements OnInit, OnDestroy {


  form: UntypedFormGroup;
  formPwdRecovery: UntypedFormGroup;
  passwordVisible: boolean = false;
  showErrors: boolean | undefined;
  error: string | undefined;
  tokensCheckboxPerso: any;

  loginPanel: boolean = true;

  routeEnum = RoutesEnum;

  resetPwdPanel: boolean = false;
  formResetPwd: UntypedFormGroup;

  token: string;
  pwdReseted: any;

  constructor(private fb: UntypedFormBuilder,
    private loginFormService: LoginFormService,
    private commonService: CommonService,
    private authService: AuthService,
    private spinner: LoadingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.form = this.fb.group({
      email: ['', [Validators.required, customEmailValidator]],
      password: ['', Validators.required],
      remember: [false]
    }, {
      updateOn: 'submit'
    });

    this.formPwdRecovery = this.fb.group({
      email: ['', [Validators.required, customEmailValidator]]
    }, {
      updateOn: 'submit'
    });

    this.formResetPwd = this.fb.group({
      resetPassword: ['', [Validators.required, minLengthPasswordValidator,
        complexityPasswordValidator]],
      resetPasswordConfirmation: ['', Validators.required]
    }, {
      updateOn: 'submit'
    })
  }


  ngOnInit(): void {
    this.spinner.hide();
    this.tokensCheckboxPerso = Style.tokensCheckboxPerso;
    this.authService.isLoggedIn();
    this.register(
      this.authService.showErrors$.subscribe(show => this.showErrors = show),

      this.route.queryParams.subscribe(params => {
        this.token = params['token'];
        this.resetPwdPanel = !!this.token;
      }),

      this.authService.passwordReseted$
        .subscribe(reseted => {
          this.pwdReseted = reseted;
        })
    )

  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }


  login() {
    if (this.form.valid) {
      let user = this.loginFormService.adaptFormToAuthUser(this.form);
      this.authService.login(user);
    } else {
      this.commonService.markAllFieldsAsDirty(this.form);
      this.form.markAllAsTouched();
    }
  }

  matchPwd(): boolean {
    return this.formResetPwd.get("resetPassword")?.value == this.formResetPwd.get("resetPasswordConfirmation")?.value;
  }

  resetPassword() {
    if (this.formResetPwd.valid && this.matchPwd()) {
      this.authService.resetPassword(this.token, this.formResetPwd.get("resetPassword")?.value);
    } else {
      this.commonService.markAllFieldsAsDirty(this.formResetPwd);
      this.formResetPwd.markAllAsTouched();
    }
  }

  toogleForgotPwd() {
    if (this.form.valid) {
      this.formPwdRecovery.get('email')?.setValue(this.form.get('email')?.value);
    }
    this.loginPanel = !this.loginPanel;
  }

  recover() {
    if (this.formPwdRecovery.valid) {
      const mail = this.formPwdRecovery.get("email").value;
      this.authService.sendRecoverPwd(mail);
    } else {
      this.commonService.markAllFieldsAsDirty(this.formPwdRecovery);
      this.formPwdRecovery.markAllAsTouched();
    }
  }

  toogleToRegister() {
    this.router.navigate(['/' + this.routeEnum.AUTH + '/' + this.routeEnum.REGISTER]);
  }

  goToLogin() {
    if (this.pwdReseted) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { token: null },
        queryParamsHandling: 'merge'
      });
    }
  }

  ngOnDestroy(): void {
    this.clean();
  }

}
