import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [TranslateModule, ButtonModule],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent implements OnInit, OnDestroy{

  isConnected: boolean;
  
  constructor() {}

  ngOnInit(): void {
  
  }
  ngOnDestroy(): void {
  
  }

  onButtonClick() {

  }

}
