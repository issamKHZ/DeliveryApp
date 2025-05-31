import { Injectable } from '@angular/core';
import { UserRoles } from '../../modele/enumerate/userRoles';
import { MenuAction } from '../../modele/enumerate/MenuAction';
import { ComponentsKeyEnum } from '../../modele/enumerate/ComponentsKey';
import { CommonService } from '../../utils/common.service';
import { RoutesEnum } from '../../modele/enumerate/routes';
import { ComponentRoutageService } from '../component-routage.service';

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
    private routageService: ComponentRoutageService
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
      default:
        this.returnToProfile();
        break;
    }
  }

  addNewOrder() {
    
    // this.routageService.selectComponent(this.component.ENTREPRISE_PROFILE);
  }

  goToLivreurs() {
    this.routageService.selectComponent(this.component.ENTREPRISE_PROFILE);
  }

  orderEntreprise() {

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
