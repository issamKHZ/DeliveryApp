import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { MessagesModule } from 'primeng/messages';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Style } from '../../../shared/constants/styles';
import { customEmailValidator } from '../../../shared/utils/validators';
import { RoutesEnum } from '../../../shared/modele/enumerate/routes';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    CardModule, 
    InputTextModule, 
    ButtonModule, 
    CheckboxModule, 
    TranslateModule,  
    RouterModule,
    MessagesModule,
    FloatLabelModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent implements OnInit{


  form: UntypedFormGroup;
  formPwdRecovery: UntypedFormGroup;
  passwordVisible: boolean = false;
  showErrors: boolean | undefined;
  error: string | undefined;
  tokensCheckboxPerso: any;

  loginPanel: boolean = true;

  routeEnum = RoutesEnum;

  constructor(private fb: UntypedFormBuilder,              
              private router: Router
  ) {
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
    })
  }

  ngOnInit(): void {
    this.tokensCheckboxPerso = Style.tokensCheckboxPerso;
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }


  login() {    
    if (this.form.valid) {
      
    } else {
      this.form.markAllAsTouched(); 
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
    } else {
      this.formPwdRecovery.markAllAsTouched(); 
    }
  }  

  toogleToRegister() {
    this.router.navigate(['/' + this.routeEnum.AUTH + '/' + this.routeEnum.REGISTER]);
  }
    

}
