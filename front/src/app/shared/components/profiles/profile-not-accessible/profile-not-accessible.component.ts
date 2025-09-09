import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { LoadingService } from '../../utils/spinner/loading.service';

@Component({
  selector: 'app-profile-not-accessible',
  standalone: true,
  imports: [
    ButtonModule,
    TranslateModule
  ],
  templateUrl: './profile-not-accessible.component.html',
  styleUrl: './profile-not-accessible.component.scss'
})
export class ProfileNotAccessibleComponent implements OnInit, OnDestroy {

  constructor (private spinner: LoadingService) {}
  
  ngOnInit(): void {

  }

  goBack() {

  }

  ngOnDestroy(): void {

  }

}
