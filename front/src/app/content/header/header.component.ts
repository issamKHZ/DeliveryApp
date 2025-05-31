import { AfterViewInit, Component, ElementRef, Input, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { BadgeModule } from 'primeng/badge';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ScrollerModule } from 'primeng/scroller';
import { MenuModule } from 'primeng/menu';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { RippleModule } from 'primeng/ripple';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserRoles } from '../../shared/modele/enumerate/userRoles';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { User } from '../../shared/modele/User';
import { NotificationsComponent } from "../../shared/components/notifications/notifications.component";
import { NotificationsService } from '../../shared/components/notifications/service/notifications.service';
import { Notification } from '../../shared/modele/Notification';
import { NotifType } from '../../shared/modele/enumerate/NotifType';
import { HeaderMenuService } from '../../shared/services/header/header-menu.service';
import { SubscriptionManager } from '../../shared/utils/subscription-manager';
import { ComponentRoutageService } from '../../shared/services/component-routage.service';
import { ComponentsKeyEnum } from '../../shared/modele/enumerate/ComponentsKey';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { RoutesEnum } from '../../shared/modele/enumerate/routes';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    ButtonModule,
    DividerModule,
    AvatarModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    MenuModule,
    IconFieldModule,
    InputIconModule,
    RippleModule,
    TranslateModule,
    PopoverModule,
    NgFor,
    NgIf,
    NgClass,
    ScrollerModule,
    BadgeModule,
    OverlayBadgeModule,
    NotificationsComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends SubscriptionManager implements OnInit, OnDestroy {

  @ViewChild('profile') profileOp!: Popover;
  @ViewChild('notif', { read: ElementRef }) notif!: ElementRef;
  @ViewChild('avatar') avatarElement!: ElementRef;
  @ViewChild('bell') bell!: ElementRef;


  @Input() items: MenuItem[];
  @Input() role: UserRoles;
  @Input() validationPages: boolean = false;
  @Input() withSideBar: boolean;
  @Input() expanded: boolean;

  fictifItems: MenuItem[];
  profileItems!: MenuItem[];

  currentUser: User;

  notifications: Notification[];
  notificationsCount: number;

  selectedMenuItem: MenuItem | null;

  isConnected: boolean;
  isValidationPhase: boolean;

  closePopupsOnResize = () => {
    if (this.profileOp && this.profileOp.overlayVisible) {
      this.profileOp.hide();
    }

    if (this.notif && this.notif.nativeElement.overlayVisible) {
      this.notif.nativeElement.hide();
    }
  }

  constructor(
    private notifService: NotificationsService,
    private menuService: HeaderMenuService,
    private routageService: ComponentRoutageService,
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {

    this.isConnected = this.authService.isLoggedIn();
    this.isValidationPhase = this.authService.isValidationPhase();

    this.currentUser = {
      fullname: "issam elkharraz",
      lastname: "elkharraz",
      mail: "issam@g.com",
      adresse: "17 b rue pierre",
      phone: "07 82 39 65 72",
      // img: "images/capgemini.jpg",
      role: UserRoles.ENTREPRISE
    }

    // Recuperer le menu de header selon le role
    this.menuService.getMenuByRole(UserRoles.ENTREPRISE);
    this.items = this.menuService.menuItems;

    //Recuperer les items de profil de current user
    this.profileItems = this.menuService.getProfileMenu(this.currentUser);

    // Une valeur fictif pour remplir le popup de notification
    this.fictifItems = [
      {
        label: '',
      },
    ];

    // Select unreaded notifications
    this.notificationsCount = this.notifService.getUnreadedNotif(this.notifications);

    // update count in the service
    this.notifService.updateCount(this.notificationsCount);

    // catch the count if it was changed in other component    
    this.notifService.currentCount.subscribe((count) => {
      this.notificationsCount = count
    });

    // Recuperer la page actuelle
    this.routageService.currentComponent$.subscribe(activeCompo => {
      if (activeCompo) {
        this.selectedMenuItem = this.routageService.findMenuItemByComponentKey(this.items, activeCompo);
        this.routageService.markActive(this.items, activeCompo);
      }
    })
  }

  ngAfterViewInit() {
    window.addEventListener('resize', this.closePopupsOnResize);
  }

  adjsutPop() {
    const popover = document.querySelector('.p-popover');
    // const avatar = document.querySelector('.p-avatar');
    if (popover && this.avatarElement) {
      const currentLeft = parseFloat(getComputedStyle(popover).left || '0');
      const currentWidth = parseFloat(getComputedStyle(popover).width || '0');
      (popover as HTMLElement).style.left = `${currentLeft + 20}px`;
      const arrowLeft = `${currentWidth * 0.83}px`;
      (popover as HTMLElement).style.setProperty('--p-popover-arrow-offset', arrowLeft);
    }
  }

  adjustNotif() {

  }


  openProfile(event: any): void {
    if (this.validationPages == false) {
      this.profileOp.toggle(event);
    }
  }

  getUserInitials(): string {
    if (!this.currentUser?.lastname) return '?';
    return this.currentUser.lastname.slice(0, 2).toUpperCase();
  }

  deconnexion(): void {
    if (this.isValidationPhase) {
      this.authService.removeMail();      
    } else {
      this.authService.logout();
    }
    this.router.navigate([RoutesEnum.AUTH]);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.closePopupsOnResize);
    this.clean();
  }

}

