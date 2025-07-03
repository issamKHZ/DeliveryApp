import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SiegesStatus, SiegesTypes } from '../../../constants/entrepConstants';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonService } from '../../../utils/common.service';
import { customEmailValidator } from '../../../utils/validators';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-add-siege',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    MessagesModule,
    ToggleSwitchModule
  ],
  templateUrl: './add-siege.component.html',
  styleUrl: './add-siege.component.scss'
})
export class AddSiegeComponent implements OnInit, OnDestroy {

  siegeTypes: any[];
  disponibilities: any[];
  dest: any[];

  form: UntypedFormGroup;

  showErrors: boolean;
  error: string;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private commonService: CommonService,) {

  }

  ngOnInit(): void {
    this.siegeTypes = SiegesTypes;
    this.disponibilities = SiegesStatus;


    this.form = this.fb.group({
      type: [null, Validators.required],
      adresse: ['', Validators.required],
      country: ['', Validators.required],
      dispo: [null, Validators.required],
      email: ['', [Validators.required, customEmailValidator]],
      phone: ['', Validators.required],
      dest: [true, Validators.required]
    }, {
      updateOn: 'submit'
    })
  }

  consoleswitch() {
    console.log(this.form.get('dest').value);
  }

  get destChoice() {
    const dest = this.form.get('dest')?.value;
    if (dest) {
      return this.translate.instant('app.profil.entreprise.sieges.dialog.dest-choices.dest');
    } else {
      return this.translate.instant('app.profil.entreprise.sieges.dialog.dest-choices.fournisseur');
    }
  }

  saveSiege() {
    this.showErrors = false;
    if (this.form.valid) {
    } else {
      this.commonService.markAllFieldsAsDirty(this.form);
      this.form.markAllAsTouched();
      if (this.commonService.hasRequiredError(this.form)) {
        this.showErrors = true;
      }
    }
  }

  ngOnDestroy(): void {

  }
}
