import { Component, Input, OnInit } from '@angular/core';
import { ComponentsKeyEnum } from '../../shared/modele/enumerate/ComponentsKey';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { SideBarProfileComponent } from '../../shared/components/side-bar/side-bar-profile/side-bar-profile.component';
import { UserRoles } from '../../shared/modele/enumerate/userRoles';
import { ProfileTabs } from '../../shared/modele/profileTabs';
import { createEntrepSideBarTabs, createLivreurSideBarTabs } from '../../shared/constants/tabs';
import { EntrepSideBar } from '../../shared/modele/enumerate/EntrepSideBar';
import { LivreurSideBar } from '../../shared/modele/enumerate/LivreurSideBar';
import { TranslateService } from '@ngx-translate/core';
import { TagSeverity } from '../../shared/components/utils/custom-tag/custom-tag.component';
import { CommonService } from '../../shared/services/utils/common.service';
import { AccountStatus } from '../../shared/modele/AccountStatus';
import { ProfilEntrepCommonService } from '../../shared/services/profile/entreprise/pEntrepCommon.service';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [NgSwitch, SideBarProfileComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {

  @Input() component: ComponentsKeyEnum;
  componentKeys = ComponentsKeyEnum;
  tabs: ProfileTabs[];
  accountStatus: { severity: TagSeverity, content: string };
  role: UserRoles;
  @Input() name: string;
  @Input() status: any;

  roles = UserRoles;
  entrepTabsCode = EntrepSideBar;
  livrTabsCode = LivreurSideBar;



  constructor(
    private translate: TranslateService,
    private commonService: CommonService,
    private pCommonService: ProfilEntrepCommonService
  ) { }


  ngOnInit(): void {
    // TODO : laisse le input ou gettable by route    
    
    this.accountStatus = { severity: this.commonService.getSeverityByCode(this.status.severity.toString()), content: this.commonService.getContextByCode(this.status.code) };
    if (this.component == this.componentKeys.ENTREPRISE_PROFILE) {
      this.role = this.roles.ENTREPRISE;
      this.tabs = createEntrepSideBarTabs(this.translate, this.entrepTabsCode, this.commonService);
    } else if (this.component == this.componentKeys.LIVREUR_PROFILE) {
      this.role = this.roles.LIVREUR;
      this.tabs = createLivreurSideBarTabs(this.translate, this.livrTabsCode, this.commonService);
    }
  }
}
