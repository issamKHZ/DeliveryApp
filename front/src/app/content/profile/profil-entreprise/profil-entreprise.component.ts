import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ComponentsKeyEnum } from '../../../shared/modele/enumerate/ComponentsKey';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../header/header.component";
import { SideBarComponent } from "../../side-bar/side-bar.component";
import { ProfilEntrepCommonService } from '../../../shared/services/profile/entreprise/pEntrepCommon.service';
import { SubscriptionManager } from '../../../shared/utils/subscription-manager';

@Component({
  selector: 'app-profil-entreprise',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SideBarComponent],
  templateUrl: './profil-entreprise.component.html',
  styleUrl: './profil-entreprise.component.scss'
})
export class ProfilEntrepriseComponent extends SubscriptionManager implements OnInit, OnDestroy {

  component: ComponentsKeyEnum;
  componentKeys = ComponentsKeyEnum;
  isSidebarVisible = false;
  

  @ViewChild('sidebar') sidebarRef!: ElementRef;
  @ViewChild('hamburgerBtn') hamburgerBtnRef!: ElementRef;  

  @ViewChild('container', { read: ElementRef }) private container!: ElementRef<HTMLDivElement>;

  constructor(private route: ActivatedRoute, private commonService: ProfilEntrepCommonService) {
    super();
  }

  ngOnInit(): void {
    this.component = this.route.snapshot.data['component'];
    this.register(
      this.commonService.showSideBar$.subscribe(value => {
        this.isSidebarVisible = value
      }),
      this.commonService.scroll$.subscribe(value => {
        if (value) {
          setTimeout(() => {
            this.container.nativeElement.scrollTo({
              top: this.container.nativeElement.scrollHeight,
              behavior: 'smooth'
            });
          }, 300);
        }
      })
    )
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent) {
    const clickedInsideSidebar = this.sidebarRef?.nativeElement.contains(event.target);
    const clickedHamburgerBtn = this.hamburgerBtnRef?.nativeElement.contains(event.target);

    if (!clickedInsideSidebar && !clickedHamburgerBtn && this.isSidebarVisible) {
      this.isSidebarVisible = false;
    }
  }

  ngOnDestroy(): void {
    this.clean();
  }
}
