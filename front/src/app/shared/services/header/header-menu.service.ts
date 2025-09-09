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
        command: () => this.actionService.executeAction(this.menuAction.PROFIL, user.role)  
      },
      {
        label: this.translate.instant('app.header.profil-items.dashboard.label'),
        icon: this.translate.instant('app.header.profil-items.dashboard.icon'),
        command: () => this.actionService.executeAction(this.menuAction.DASHBOARD, user.role)
      },
      {
        label: this.translate.instant('app.header.profil-items.settings.label'),
        icon: this.translate.instant('app.header.profil-items.settings.icon'),
        command: () => this.actionService.executeAction(this.menuAction.SETTINGS, user.role)
      }
    ];
  }

  getMenuByRole(userRole: UserRoles) {          
    switch (userRole) {
      case UserRoles.ENTREPRISE.toString().toUpperCase():
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
      case this.roles.LIVREUR.toString().toUpperCase():
        this.menuItems = [
          {
            label: this.translate.instant('app.header.menu.livreur.commandes.label'),
            icon: "pi pi-sitemap",
            items: [
              {
                label: this.translate.instant('app.header.menu.livreur.commandes.postuler'),
                icon: "pi pi-check-square",
                command: () => this.actionService.executeAction(this.menuAction.POSTULER),
                component: this.component.POSTULER_ORDER
              },
              {                
                label: this.translate.instant('app.header.menu.livreur.commandes.mycommandes'),
                icon: "pi pi-inbox",
                command: () => this.actionService.executeAction(this.menuAction.MY_COMMANDS, this.roles.LIVREUR),
                component: this.component.M_ORDERS_LIVREUR
              }
            ]
          },
          {
            label: this.translate.instant('app.header.menu.livreur.commandelance'),
            icon: "pi pi-truck",
            command: () => this.actionService.executeAction(this.menuAction.EN_COURS),
            component: this.component.ORDER_RUNNING
          },
          {
            label: this.translate.instant('app.header.menu.livreur.discussion'),
            icon: "pi pi-comment",
            command: () => this.actionService.executeAction(this.menuAction.DISCUSSION, this.roles.LIVREUR),
            component: this.component.DISCUSSION_LIVREUR
          }
        ];
        break;
      case this.roles.ADMIN.toString().toUpperCase():
        this.menuItems = [];
        break;
      default:
        this.menuItems = [];
        break;
    }
  }
}
