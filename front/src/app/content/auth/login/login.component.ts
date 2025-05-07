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
import { Style } from '../../../shared/constants/styles';


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
    MessagesModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  form: UntypedFormGroup;
  passwordVisible: boolean = false;
  showErrors: boolean | undefined;
  error: string | undefined;
  tokensCheckboxPerso: any;

  constructor(private fb: UntypedFormBuilder,              
              private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required], 
      remember: [false] 
    }, {
      updateOn: 'submit' 
    });
  }

  ngOnInit(): void {
    this.tokensCheckboxPerso = Style.tokensCheckboxPerso;
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }


  login() {    
    // if (this.form.valid) {
    //   this.authService.login(this.form).subscribe({
    //     next: (response) => {
    //       this.userService.initUser(new User({mail: response.username}))
    //       this.authService.updatelog(true);
    //       this.router.navigate(['/landing']);
    //     },
    //     error: (error) => {
    //       this.showErrors = true;          
    //       this.error = error.message;            
    //     }
    //   });
    // } else {
    //   this.form.markAllAsTouched(); 
    // }
  }

}
