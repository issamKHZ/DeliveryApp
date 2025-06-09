import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubscriptionManager } from '../../../../utils/subscription-manager';

@Component({
  selector: 'app-sites-coordinates',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './sites-coordinates.component.html',
  styleUrl: './sites-coordinates.component.scss'
})
export class SitesCoordinatesComponent extends SubscriptionManager implements OnInit, OnDestroy {
  
  constructor() 
    {super()}
  
  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {
    
  }

}
