import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { AuthComponent } from "./content/auth/auth.component";
import { HeaderComponent } from "./content/header/header.component";
import { filter } from 'rxjs';
import { NgIf } from '@angular/common';
import { SpinnerComponent } from './shared/components/utils/spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ButtonModule, ToastModule, HeaderComponent, NgIf, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  currentRoute: string;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;        
      });
  }

  displayHeader(): boolean {
    if (this.currentRoute) {
      return !this.currentRoute.startsWith('/auth') && !this.currentRoute.startsWith('/profile');
    }
    return false;
  }
}
