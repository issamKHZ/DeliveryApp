import { Injectable } from '@angular/core';
import { AuthUser } from '../modele/AuthUser';
import { LoginService } from './login.service';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoadingService } from '../components/utils/spinner/loading.service';
import { Router } from '@angular/router';
import { CommonService } from '../utils/common.service';
import { RoutesEnum } from '../modele/enumerate/routes';
import { UserRoles } from '../modele/enumerate/userRoles';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly SESSION_USER_KEY = 'token';

  private _showErrors = new BehaviorSubject<boolean | null>(null);
  showErrors$ = this._showErrors.asObservable();

  private _passwordReseted = new BehaviorSubject<boolean>(false);
  public passwordReseted$ = this._passwordReseted.asObservable();

  constructor(
    private loginService: LoginService,
    private spinner: LoadingService,
    private commonService: CommonService,
    private translate: TranslateService,
    private message: MessageService,
    private router: Router
  ) { }

  login(user: AuthUser): void {
    this.spinner.show
    this.loginService.login(user).subscribe({
      next: (response) => {
        this.spinner.hide();
        if (response.token) {
          this.saveToken(response.token);
          this.removeMail();
          this._showErrors.next(false);

          this.goToProfile();
        }
      },
      error: (error) => {
        this.spinner.hide();
        if (error.error == "credentials") {
          this._showErrors.next(true);
        } else if (error.error == "user not validated") {
          sessionStorage.setItem('mail', user.email);
          this.router.navigate([this.commonService.composeRoute([RoutesEnum.VALIDATION, RoutesEnum.MAIL])])
        }
      }
    })
  }


  sendRecoverPwd(mail: any) {
    this.loginService.sendRecoverPwd(mail).subscribe({
      next: () => {
        this.message.add({
          severity: 'info', summary: this.translate.instant('app.auth.login.messages.reset-pwd-email.summary'),
          detail: this.translate.instant('app.auth.login.messages.reset-pwd-email.detail'), life: 5000
        });
      },
      error: () => {
        this.message.add({
          severity: 'info', summary: this.translate.instant('app.auth.login.messages.reset-pwd-email.summary'),
          detail: this.translate.instant('app.auth.login.messages.reset-pwd-email.detail'), life: 5000
        });
      }
    })
  }

  resetPassword(token: string, password: string) {
    this.loginService.resetPassword(token, password).subscribe({
      next: () => {
        this._passwordReseted.next(true);
      },
      error: () => {
        this._passwordReseted.next(false);
        this.message.add({
          severity: 'error', summary: this.translate.instant('app.auth.reset-pwd.messages.error.summary'),
          detail: this.translate.instant('app.auth.reset-pwd.messages.error.detail'), life: 5000
        });
      }
    });
  }


  saveToken(token: string) {
    sessionStorage.setItem(this.SESSION_USER_KEY, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.SESSION_USER_KEY);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp > currentTime) {
        return true;
      } else {
        sessionStorage.clear();
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate([RoutesEnum.AUTH])
  }

  getValidationMail(): string | null {
    return sessionStorage.getItem('mail');
  }

  isValidationPhase(): boolean {
    const mail = this.getValidationMail();
    return mail ? true : false;
  }

  removeMail(): void {
    sessionStorage.removeItem('mail');
  }

  goToProfile(): void {
    const role = this.getUserRole()?.toLowerCase();
    let destination = RoutesEnum.ERROR;

    if (role === UserRoles.ENTREPRISE.toLowerCase()) {
      destination = RoutesEnum.PROFILE_ENTREPRISE;
    } else if (role === UserRoles.LIVREUR.toLowerCase()) {
      destination = RoutesEnum.PROFILE_LIVREUR;
    }

    this.router.navigate([destination]);
  }
}
