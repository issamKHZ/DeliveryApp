import { Component, OnDestroy, OnInit } from '@angular/core';
import { ComponentsKeyEnum } from '../../../shared/modele/enumerate/ComponentsKey';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../header/header.component";
import { SideBarComponent } from "../../side-bar/side-bar.component";

@Component({
  selector: 'app-profil-entreprise',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SideBarComponent],
  templateUrl: './profil-entreprise.component.html',
  styleUrl: './profil-entreprise.component.scss'
})
export class ProfilEntrepriseComponent implements OnInit, OnDestroy {

  component: ComponentsKeyEnum;
  componentKeys = ComponentsKeyEnum;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.component = this.route.snapshot.data['component'];
  }
  ngOnDestroy(): void {

  }
}
