import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/components/utils/spinner/loading.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { ComponentsKeyEnum } from '../../../shared/modele/enumerate/ComponentsKey';
import { HeaderComponent } from '../../header/header.component';
import { SideBarComponent } from '../../side-bar/side-bar.component';

@Component({
  selector: 'app-profil-livreur',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SideBarComponent],
  templateUrl: './profil-livreur.component.html',
  styleUrl: './profil-livreur.component.scss'
})
export class ProfilLivreurComponent implements OnInit, OnDestroy {

  component: ComponentsKeyEnum;
  componentKeys = ComponentsKeyEnum;

  constructor(private spinner: LoadingService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.spinner.hide();
    this.component = this.route.snapshot.data['component'];
  }
  ngOnDestroy(): void {

  }

}
