import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SiegesStatus, SiegesTypes } from '../../../constants/entrepConstants';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonService } from '../../../services/utils/common.service';
import { customEmailValidator } from '../../../utils/validators';
import { MessagesModule } from 'primeng/messages';
import { SiegeHttpService } from '../../../services/profile/entreprise/siege/siege.http.service';
import { SubscriptionManager } from '../../../utils/subscription-manager';
import { forkJoin } from 'rxjs';
import { SiegeService } from '../../../services/profile/entreprise/siege/siege.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CollectionItem } from '../../../modele/CollectionItem';
import { MessageService } from 'primeng/api';
import { PhoneNumberDirective } from '../../../directives/phone-number.directive';

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
    ToggleSwitchModule,
    PhoneNumberDirective
  ],
  templateUrl: './add-siege.component.html',
  styleUrl: './add-siege.component.scss'
})
export class AddSiegeComponent extends SubscriptionManager implements OnInit, OnDestroy {

  siegeTypes: any[];
  disponibilities: any[];
  cities: any[];
  dest: any[];

  form: UntypedFormGroup;

  showErrors: boolean;
  error: string;
  destChoice: boolean;

  entrepriseID: string;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private commonService: CommonService,
    private siegeHttpService: SiegeHttpService,
    private siegeService: SiegeService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private message: MessageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.entrepriseID = this.config.data.entrepriseID;

    forkJoin([
      this.siegeHttpService.getSitesTypes(),
      this.siegeHttpService.getDisponilities(),
      this.siegeHttpService.getCities()
    ]).subscribe(([types, dispos, cities]) => {
      this.siegeTypes = types;
      this.disponibilities = dispos;
      this.cities = this.siegeService.adaptCitiesOptions(cities);      
    })
    this.destChoice = this.translate.instant('app.profil.entreprise.sieges.dialog.dest-choices.dest');


    this.form = this.fb.group({
      type: [null, Validators.required],
      adresse: ['', Validators.required],
      country: [null, Validators.required],
      dispo: [null, Validators.required],
      email: ['', [Validators.required, customEmailValidator]],
      phone: ['', Validators.required],
      dest: [true, Validators.required]
    });

    this.form.get('dest').valueChanges.subscribe((value) => {
      if (value) {
        this.destChoice = this.translate.instant('app.profil.entreprise.sieges.dialog.dest-choices.dest');
      } else {
        this.destChoice = this.translate.instant('app.profil.entreprise.sieges.dialog.dest-choices.fournisseur');
      }
    })
  }

  // get destChoice() {
  //   const dest = this.form.get('dest')?.value;
  //   if (dest) {
  //     return this.translate.instant('app.profil.entreprise.sieges.dialog.dest-choices.dest');
  //   } else {
  //     return this.translate.instant('app.profil.entreprise.sieges.dialog.dest-choices.fournisseur');
  //   }
  // }

  saveSiege() {
    this.showErrors = false;
    if (this.form.valid) {
      let siege = this.siegeService.adaptAddingFormToModel(this.form, this.entrepriseID);
      this.register(
        this.siegeHttpService.addSite(siege).subscribe({
          next: (response) => {
            this.message.add({
              severity: 'success', summary: this.translate.instant('app.profil.entreprise.sieges.dialog.messages.add-success.summary'),
              detail: this.translate.instant('app.profil.entreprise.sieges.dialog.messages.add-success.detail'), life: 6000
            });
            this.ref.close(response);
          },
          error: () => {
            this.message.add({
              severity: 'error', summary: this.translate.instant('app.profil.entreprise.sieges.dialog.messages.add-success.summary'),
              detail: this.translate.instant('app.profil.entreprise.sieges.dialog.messages.add-success.detail'), life: 6000
            });
          }
        })
      );
    } else {
      this.commonService.markAllFieldsAsDirty(this.form);
      this.form.markAllAsTouched();
      if (this.commonService.hasRequiredError(this.form)) {
        this.showErrors = true;
      }
    }
  }
  

  ngOnDestroy(): void {
    this.clean();
  }
}
