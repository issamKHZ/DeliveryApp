import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SubscriptionManager } from '../../utils/subscription-manager';
import { interval, Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailValidationService } from '../../services/Authentication/email-validation.service';
import { LoadingService } from '../utils/spinner/loading.service';
import { UserAfterValid } from '../../modele/UserAfterValid';
import { MessageService } from 'primeng/api';
import { CommonService } from '../../services/utils/common.service';
import { RoutesEnum } from '../../modele/enumerate/routes';
import { AuthService } from '../../services/Authentication/auth.service';
import { RedirectionService } from '../../services/redirection.service';

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
export class EmailValidationComponent extends SubscriptionManager implements OnInit, OnDestroy {
  loading = false;
  isDisabled = false;
  showMessage = false;
  countdown = 0;
  private subscription!: Subscription;

  userMail: string;

  token: string;


  constructor(
    private route: ActivatedRoute,
    private emailValidationService: EmailValidationService,
    private spinner: LoadingService,
    private auth: AuthService,
    private message: MessageService,
    private translate: TranslateService,
    private router: Router,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userMail = this.auth.getValidationMail();

      this.token = params['token'];

      if (this.token) {
        this.spinner.show();
        this.register(
          this.emailValidationService.validate(this.token).subscribe({
            next: (response: UserAfterValid) => {            
              if (response.redirectToLogin) {                
                if (response.message == "wait for support") {
                  this.message.add({
                    severity: 'info', summary: this.translate.instant('app.email-validation.messages.wait-for-support.summary'),
                    detail: this.translate.instant('app.email-validation.messages.wait-for-support.detail'), life: 6000
                  });
                }
                this.router.navigate([RoutesEnum.AUTH]);
                this.spinner.hide()
              } else if (response.token != null) {
                this.spinner.hide();
                this.authService.saveToken(response.loginToken);
                this.authService.goToProfile();
              }
            },
            error: (error) => {
            }
          })
        );
      }
    });
  }

  onButtonClick() {
    this.isDisabled = true;
    this.showMessage = false;
    this.countdown = 60;

    this.register(
      this.emailValidationService.sendEmailValidation(this.userMail).subscribe({
        next: (response) => {
          if (response) {
            this.message.add({
              severity: 'info', summary: this.translate.instant('app.auth.register.register-entreprise.messages.info.summary'),
              detail: this.translate.instant('app.auth.register.register-entreprise.messages.info.detail'), life: 5000
            });
          }
        },
        error: (error) => {
          if (error.error == "tokenValue") {
            this.message.add({
              severity: 'error', summary: this.translate.instant('app.auth.register.register-entreprise.messages.token-error.summary'),
              detail: this.translate.instant('app.auth.register.register-entreprise.messages.token-error.detail'), life: 5000
            });
          }
        }
      }),

      interval(1000).subscribe(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          this.showMessage = true;
          this.isDisabled = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.clean();
  }
}