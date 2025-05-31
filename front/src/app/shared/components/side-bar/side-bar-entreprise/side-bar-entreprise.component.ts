import { Component, Input, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { CustomTagComponent, TagSeverity } from "../../utils/custom-tag/custom-tag.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProfileTabs } from '../../../modele/profileTabs';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { EntrepSideBar } from '../../../modele/enumerate/EntrepSideBar';
import { BadgeModule } from 'primeng/badge';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-side-bar-entreprise',
  standalone: true,
  imports: [
    DividerModule,
    AvatarModule,
    ButtonModule,
    RippleModule,
    BadgeModule,
    TagModule,
    CustomTagComponent,
    TranslateModule,
    NgClass,
    NgFor,
    NgIf
  ],
  templateUrl: './side-bar-entreprise.component.html',
  styleUrl: './side-bar-entreprise.component.scss'
})
export class SideBarEntrepriseComponent implements OnInit {

  @Input() userName: string = 'test test';
  @Input() notifCount: number = 92;

  //enum
  tagSeverity = TagSeverity;
  tabsCodes = EntrepSideBar;

  tabs: ProfileTabs[];

  constructor(private translate: TranslateService,
              private authService: AuthService
  ) { }


  ngOnInit(): void {
    this.tabs = [
      {
        label: this.translate.instant('app.profil.entreprise.side-bar.tabs.general'),
        icon: "pi pi-list",
        route: "",
        code: this.tabsCodes.GENERAL
      },
      {
        label: this.translate.instant('app.profil.entreprise.side-bar.tabs.admin'),
        icon: "pi pi-info-circle",
        route: "",
        code: this.tabsCodes.ADMIN
      },
      {
        label: this.translate.instant('app.profil.entreprise.side-bar.tabs.sieges'),
        icon: "pi pi-map-marker",
        route: "",
        code: this.tabsCodes.SIEGES
      },
      {
        label: this.translate.instant('app.profil.entreprise.side-bar.tabs.notifications'),
        icon: "pi pi-bell",
        route: "",
        code: this.tabsCodes.NOTIF
      },
      {
        label: this.translate.instant('app.profil.entreprise.side-bar.tabs.statistic'),
        icon: "pi pi-chart-bar",
        route: "",
        code: this.tabsCodes.STATISTIC
      },
      {
        label: this.translate.instant('app.profil.entreprise.side-bar.tabs.preferences'),
        icon: "pi pi-star",
        route: "",
        code: this.tabsCodes.PREFERENCES
      },
      {
        label: this.translate.instant('app.profil.entreprise.side-bar.tabs.settings'),
        icon: "pi pi-wrench",
        route: "",
        code: this.tabsCodes.SETTINGS
      },
    ]
  }


  closeCallback($event: MouseEvent) {
    throw new Error('Method not implemented.');
  }

  logout() {
    this.authService.logout();
  }

}
