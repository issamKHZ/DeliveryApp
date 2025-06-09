import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { CustomTagComponent, TagSeverity } from '../../utils/custom-tag/custom-tag.component';
import { UserRoles } from '../../../modele/enumerate/userRoles';
import { ProfileTabs } from '../../../modele/profileTabs';
import { EntrepSideBar } from '../../../modele/enumerate/EntrepSideBar';
import { AuthService } from '../../../services/auth.service';
import { LargeContentFieldComponent } from "../../utils/large-content-field/large-content-field.component";
import { Style } from '../../../constants/styles';
import { ComponentRoutageService } from '../../../services/component-routage.service';
import { SubscriptionManager } from '../../../utils/subscription-manager';
import { Router } from '@angular/router';
import { LoadingService } from '../../utils/spinner/loading.service';
import { ProfilEntrepCommonService } from '../../../services/profile/entreprise/pEntrepCommon.service';

@Component({
  selector: 'app-side-bar-profile',
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
    CommonModule,
    LargeContentFieldComponent
  ],
  templateUrl: './side-bar-profile.component.html',
  styleUrl: './side-bar-profile.component.scss'
})
export class SideBarProfileComponent extends SubscriptionManager implements OnInit, OnDestroy {


  @Input() userName: string;
  @Input() tabs: ProfileTabs[];
  @Input() notifCount: number = 92;
  @Input() role: UserRoles;
  @Input() accountStatus: { severity: TagSeverity, content: string };

  tabsCodes = EntrepSideBar;
  colors = Style;

  constructor(private authService: AuthService,
    private router: Router,
    private spinner: LoadingService,
    private cdRef: ChangeDetectorRef,
    private commonService: ProfilEntrepCommonService,
    private routageService: ComponentRoutageService) {
    super();
  }

  ngOnInit(): void {
    this.reloadTabs();
    this.register(
      this.routageService.currentTab$.subscribe(tab => {
        if (tab) {
          this.routageService.markTabActive(this.tabs, tab);
        }
      }));
  }

  private reloadTabs(): void {
    if (this.tabs) {
      this.tabs = this.tabs.map(tab => ({
        ...tab,
        isnotif: this.shouldShowBadge(tab)
      }));
      this.cdRef.detectChanges();
    }
  }

  isTabActive(tab: ProfileTabs): boolean {
    return (tab as any).isActive;
  }

  selectTab(tab: ProfileTabs) {    
    this.router.navigate([tab.route]);    
    this.commonService.toggleSideBar(false);
    this.routageService.markTabActive(this.tabs, tab.code);
  }

  logout() {
    this.authService.logout();
  }

  shouldShowBadge(tab: any): boolean {
    return this.notifCount > 0 && tab.code === this.tabsCodes.NOTIF;
  }

  ngOnDestroy(): void {
    this.clean();
  }
}
