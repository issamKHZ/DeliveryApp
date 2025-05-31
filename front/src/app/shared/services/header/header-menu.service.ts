import { Injectable } from '@angular/core';
import { UserRoles } from '../../modele/enumerate/userRoles';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../modele/User';
import { HeaderActionsService } from './header-actions.service';
import { MenuAction } from '../../modele/enumerate/MenuAction';
import { ComponentsKeyEnum } from '../../modele/enumerate/ComponentsKey';

@Injectable({
  providedIn: 'root'
})
export class HeaderMenuService {

  constructor(
    private translate: TranslateService,
    private actionService: HeaderActionsService  
  ) { }

  roles = UserRoles;
  menuItems: MenuItem[] = [];
  menuAction = MenuAction;
  component = ComponentsKeyEnum;

  getProfileMenu(user: User): MenuItem[] {
    return [
      {
        label: this.translate.instant('app.header.profil-items.profil.label'),
        icon: this.translate.instant('app.header.profil-items.profil.icon'),
        command: () => {},        
      },
      {
        label: this.translate.instant('app.header.profil-items.dashboard.label'),
        icon: this.translate.instant('app.header.profil-items.dashboard.icon'),
        command: () => {}
      },
      {
        label: this.translate.instant('app.header.profil-items.settings.label'),
        icon: this.translate.instant('app.header.profil-items.settings.icon'),
        command: () => {}
      }
    ];
  }

  getMenuByRole(userRole: UserRoles) {
    switch (userRole) {
      case this.roles.ENTREPRISE:
        this.menuItems = [
          {
            label: this.translate.instant('app.header.menu.entreprise.commandes.label'),
            icon: "pi pi-sitemap",
            items: [
              {
                label: this.translate.instant('app.header.menu.entreprise.commandes.create'),
                icon: "pi pi-megaphone", 
                command: () => this.actionService.executeAction(this.menuAction.NEW_COMMAND),                
                component: this.component.PUBLISH_ORDER
              },
              {                
                label: this.translate.instant('app.header.menu.entreprise.commandes.consult'),
                icon: "pi pi-inbox",
                command: () => this.actionService.executeAction(this.menuAction.MY_COMMANDS, this.roles.ENTREPRISE),
                component: this.component.M_ORDERS_ENTREPRISE
              }
            ]
          },
          {
            label: this.translate.instant('app.header.menu.entreprise.livreurs'),
            icon: "pi pi-users",
            command: () => this.actionService.executeAction(this.menuAction.LIVREURS),       
            component: this.component.M_LIVREURS
          },
          {
            label: this.translate.instant('app.header.menu.entreprise.discussion'),
            icon: "pi pi-comment",
            command: () => this.actionService.executeAction(this.menuAction.DISCUSSION, this.roles.ENTREPRISE),
            component: this.component.DISCUSSION_ENTREPRISE
          }
        ];
        break;
      case this.roles.LIVREUR:
        this.menuItems = [
          {
            label: this.translate.instant('app.header.menu.livreur.commandes.label'),
            icon: "pi pi-sitemap",
            items: [
              {
                label: this.translate.instant('app.header.menu.livreur.commandes.postuler'),
                icon: "pi-check-square",
                command: () => this.actionService.executeAction(this.menuAction.POSTULER),
                component: this.component.POSTULER_ORDER
              },
              {                
                label: this.translate.instant('app.header.menu.livreur.commandes.mes-commandes'),
                icon: "pi pi-inbox",
                command: () => this.actionService.executeAction(this.menuAction.MY_COMMANDS, this.roles.LIVREUR),
                component: this.component.M_ORDERS_LIVREUR
              }
            ]
          },
          {
            label: this.translate.instant('app.header.menu.livreur.commandes.commande-lance'),
            icon: "pi pi-truck",
            command: () => this.actionService.executeAction(this.menuAction.EN_COURS),
            component: this.component.ORDER_RUNNING
          },
          {
            label: this.translate.instant('app.header.menu.livreur.commandes.discussion'),
            icon: "pi pi-comment",
            command: () => this.actionService.executeAction(this.menuAction.DISCUSSION, this.roles.LIVREUR),
            component: this.component.DISCUSSION_LIVREUR
          }
        ];
        break;
      case this.roles.ADMIN:
        this.menuItems = [];
        break;
      default:
        this.menuItems = [];
        break;
    }
  }
}
