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
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly COOKIE_USER_KEY = 'token';
  private readonly COOKIE_MAIL_KEY = 'mail';

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
    private router: Router,
    private cookieService: CookieService
  ) { }

  login(user: AuthUser): void {
    this.spinner.show();
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
          // mail cookie = 30 min d'expiration
          const expires = new Date();
          expires.setMinutes(expires.getMinutes() + 30);
          this.cookieService.set(this.COOKIE_MAIL_KEY, user.email, expires, '/', '', true, "Strict");

          this.router.navigate([this.commonService.composeRoute([RoutesEnum.VALIDATION, RoutesEnum.MAIL])]);
        }
      }
    });
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
    });
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
    // Décode le JWT pour récupérer exp
    const decoded: any = jwtDecode(token);

    if (decoded.exp) {
      // exp est en secondes (UTC)
      const expires = new Date(decoded.exp * 1000);
      this.cookieService.set(this.COOKIE_USER_KEY, token, expires, '/', '', true, "Strict");
    } else {
      // S'il n'y a pas exp (rare), fallback à 1 jour
      this.cookieService.set(this.COOKIE_USER_KEY, token, 1, '/', '', true, "Strict");
    }
  }

  getToken(): string | null {
    const token = this.cookieService.get(this.COOKIE_USER_KEY);
    return token || null;
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
        this.logout();
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  logout() {
    this.cookieService.delete(this.COOKIE_USER_KEY, '/');
    this.cookieService.delete(this.COOKIE_MAIL_KEY, '/');
    this.router.navigate([RoutesEnum.AUTH]);
  }


  saveMail(mail: string) {
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 30);
    this.cookieService.set(this.COOKIE_MAIL_KEY, mail, expires, '/', '', true, "Strict");
  }

  getValidationMail(): string | null {
    const mail = this.cookieService.get(this.COOKIE_MAIL_KEY);
    return mail || null;
  }

  isValidationPhase(): boolean {
    const mail = this.getValidationMail();
    return mail ? true : false;
  }

  removeMail(): void {
    this.cookieService.delete(this.COOKIE_MAIL_KEY, '/');
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
