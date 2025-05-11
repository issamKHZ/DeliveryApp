import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SubscriptionManager } from '../../utils/subscription-manager';
import { interval, Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-email-validation',
  standalone: true,
  imports: [
    ButtonModule,
    TranslateModule
  ],
  templateUrl: './email-validation.component.html',
  styleUrls: ['./email-validation.component.scss'],
})
export class EmailValidationComponent extends SubscriptionManager {
  loading = false;
  isDisabled = false;
  showMessage = false;
  countdown = 0;
  private subscription!: Subscription;
  


  constructor() {
    super();
  }  

  onButtonClick() {
    this.isDisabled = true;
    this.showMessage = false;
    this.countdown = 120;

    this.subscription = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.subscription.unsubscribe();
        this.showMessage = true;
        this.isDisabled = false;
      }
    });
  }

  ngOnDestroy() {
    // Nettoyer si le composant est détruit
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}