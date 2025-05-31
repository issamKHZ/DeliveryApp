import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from '../../../shared/components/utils/spinner/loading.service';

@Component({
  selector: 'app-profil-livreur',
  standalone: true,
  imports: [],
  templateUrl: './profil-livreur.component.html',
  styleUrl: './profil-livreur.component.scss'
})
export class ProfilLivreurComponent implements OnInit, OnDestroy{

  constructor(private spinner: LoadingService) {}

  ngOnInit(): void {
    this.spinner.hide();
  }
  ngOnDestroy(): void {
  
  }

}
