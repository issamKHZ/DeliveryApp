import { Component, Input } from '@angular/core';
import { ComponentsKeyEnum } from '../../shared/modele/enumerate/ComponentsKey';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { SideBarEntrepriseComponent } from '../../shared/components/side-bar/side-bar-entreprise/side-bar-entreprise.component';
import { SideBarLivreurComponent } from '../../shared/components/side-bar/side-bar-livreur/side-bar-livreur.component';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase, SideBarEntrepriseComponent, SideBarLivreurComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {

  @Input() component: ComponentsKeyEnum;
  componentKeys = ComponentsKeyEnum;
}
