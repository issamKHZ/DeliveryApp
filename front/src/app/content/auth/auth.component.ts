import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from "./login/login.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, FormsModule, LoginComponent, TranslateModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  isLogin = true;

  toggleMode() {
    this.isLogin = !this.isLogin;
  }
}
