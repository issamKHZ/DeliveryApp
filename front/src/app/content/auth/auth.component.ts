import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from "./login/login.component";
import { TranslateModule } from '@ngx-translate/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { filter } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, FormsModule, RouterOutlet, TranslateModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      // transition(':leave', [
      //   animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      // ])
    ])
  ]

})


export class AuthComponent implements OnInit {
  isLogin: boolean = false;
  isRegisterPage: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.updatePageState(this.router.url); // ← Ajouté
  }

  ngAfterViewInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updatePageState(event.url);
      });
  }

  updatePageState(url: string) {
    this.isRegisterPage = url.includes('/register');
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
  }
}

