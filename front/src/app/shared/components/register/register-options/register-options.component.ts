import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { RoutesEnum } from '../../../modele/enumerate/routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-options',
  standalone: true,
  imports: [
    CardModule,
    TranslateModule
  ],
  templateUrl: './register-options.component.html',
  styleUrl: './register-options.component.scss'
})
export class RegisterOptionsComponent {


  routeEnum = RoutesEnum;
  readonly registerRoute = '/' + this.routeEnum.AUTH + '/' + this.routeEnum.REGISTER + '/';

  constructor(private router: Router) {}

  toggleToLogin() {
    this.router.navigate(['/' + this.routeEnum.AUTH + '/' + this.routeEnum.LOGIN]);
  }

  registerAsLivreur() {
    this.router.navigate([this.registerRoute + this.routeEnum.LIVREUR]);
  }

  registerAsEntreprise() {
    this.router.navigate([this.registerRoute + this.routeEnum.ENTREPRISE]);
  }

}
