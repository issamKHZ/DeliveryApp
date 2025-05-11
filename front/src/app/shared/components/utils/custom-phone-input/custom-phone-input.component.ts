import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { Country } from '../../../modele/Country';
import { countries } from '../../../constants/countries';
import { RegisterFormService } from '../../register/service/register-form.service';
import { SelectModule } from 'primeng/select';
import { InputMaskModule } from 'primeng/inputmask';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-custom-phone-input',
  standalone: true,
  imports: [
    NgIf,
    InputTextModule,
    ReactiveFormsModule,
    SelectModule,
    InputMaskModule,
    TranslateModule
  ],
  templateUrl: './custom-phone-input.component.html',
  styleUrls: ['./custom-phone-input.component.scss'],
})
export class CustomPhoneInputComponent implements OnInit {

  @Input() indicatif: UntypedFormControl;
  @Input() lphone: UntypedFormControl;  

  countries: Country[] = [];
  selectedCountry: Country;

  constructor(private registerFormService: RegisterFormService) { }

  ngOnInit() {
    console.log("enter");
    
    this.countries = countries;
    this.registerFormService.initIndicatif('MA', this.indicatif, this.countries);
    this.selectedCountry = this.indicatif?.value
  }

  onCountryChange(selectedItem: any) {
    this.selectedCountry = selectedItem;
  }
}

