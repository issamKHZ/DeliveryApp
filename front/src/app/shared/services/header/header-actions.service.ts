import { Injectable } from '@angular/core';
import { UserRoles } from '../../modele/enumerate/userRoles';
import { MenuAction } from '../../modele/enumerate/MenuAction';
import { ComponentsKeyEnum } from '../../modele/enumerate/ComponentsKey';
import { CommonService } from '../utils/common.service';
import { RoutesEnum } from '../../modele/enumerate/routes';
import { ComponentRoutageService } from '../component-routage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HeaderActionsService {

  routes = RoutesEnum;
  menuAction = MenuAction;
  roles = UserRoles;
  component = ComponentsKeyEnum;

  constructor(
    private commonService: CommonService,
    private routageService: ComponentRoutageService,
    private router: Router
  ) { }

  executeAction(action: MenuAction, role?: UserRoles) {
    switch (action) {
      case this.menuAction.NEW_COMMAND:
        this.addNewOrder();
        break;
      case this.menuAction.LIVREURS:
        this.goToLivreurs();
        break;
      case this.menuAction.MY_COMMANDS:
        if (role == this.roles.ENTREPRISE) {
          this.orderEntreprise();
        } else if ((role == this.roles.LIVREUR)) {
          this.orderLivreurs();
        }
        break;

      case this.menuAction.POSTULER:
        this.postuler();
        break;

      case this.menuAction.EN_COURS:
        this.goToOrderInProgress();
        break;
      case this.menuAction.DISCUSSION:
        if (role == this.roles.ENTREPRISE) {
          this.discussionEntreprise()
        } else if ((role == this.roles.LIVREUR)) {
          this.discussionLivreur();
        }
        break;
      case this.menuAction.PROFIL:
        this.goToProfile(role);
        break;
      case this.menuAction.DASHBOARD:
        this.goToDashboard(role);
        break;
      case this.menuAction.SETTINGS:
        this.goToSettings(role);
        break;
      default:
        this.returnToProfile();
        break;
    }
  }

  goToProfile(role: UserRoles) {
    if (role == this.roles.ENTREPRISE.toString().toUpperCase()) {
      this.router.navigate([this.routes.PROFILE_ENTREPRISE])
    } else if ((role == this.roles.LIVREUR.toString().toUpperCase())) {
      this.router.navigate([this.routes.PROFILE_LIVREUR])
    }
  }

  goToDashboard(role: UserRoles) {
    if (role == this.roles.ENTREPRISE.toString().toUpperCase()) {
      this.router.navigate([this.commonService.composeRoute([this.routes.PROFILE_ENTREPRISE, this.routes.STATISTICS])])
    } else if ((role == this.roles.LIVREUR.toString().toUpperCase())) {
      this.router.navigate([this.commonService.composeRoute([this.routes.PROFILE_LIVREUR, this.routes.STATISTICS])])
    }
  }
  goToSettings(role: UserRoles) {
    if (role == this.roles.ENTREPRISE.toString().toUpperCase()) {
      this.router.navigate([this.commonService.composeRoute([this.routes.PROFILE_ENTREPRISE, this.routes.SETTINGS])])
    } else if ((role == this.roles.LIVREUR.toString().toUpperCase())) {
      this.router.navigate([this.commonService.composeRoute([this.routes.PROFILE_LIVREUR, this.routes.SETTINGS])])
    }
  }

  addNewOrder() {

    // this.routageService.selectComponent(this.component.ENTREPRISE_PROFILE);
  }

  goToLivreurs() {    
  }

  orderEntreprise() {    
    this.routageService.selectComponent(this.component.M_ORDERS_ENTREPRISE);
    this.router.navigate([this.commonService.composeRoute([this.routes.ENTREPRISE, this.routes.COMMADES])]);
  }

  orderLivreurs() {

  }

  postuler() {

  }

  goToOrderInProgress() {

  }

  discussionEntreprise() {

  }

  discussionLivreur() {

  }

  returnToProfile() {

  }
}
