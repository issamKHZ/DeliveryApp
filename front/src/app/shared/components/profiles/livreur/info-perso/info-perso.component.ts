import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { PLivreurCommonService } from '../../../../services/profile/livreur/p-livreur-common.service';
import { InfosLivreur } from '../../../../modele/livreur/Info-Livreur';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { CollectionItem } from '../../../../modele/CollectionItem';
import { languesOptions } from '../../../../constants/livreurConstants';
import { AvatarModule } from 'primeng/avatar';
import { CustomTagComponent, TagSeverity } from '../../../utils/custom-tag/custom-tag.component';
import { ComponentRoutageService } from '../../../../services/component-routage.service';
import { LivreurSideBar } from '../../../../modele/enumerate/LivreurSideBar';
import { ProfileImgComponent } from '../../../utils/profile-img/profile-img.component';
import { AttachmentFieldComponent } from '../../../utils/attachment-field/attachment-field.component';
import { ConfirmationService } from 'primeng/api';
import { SubscriptionManager } from '../../../../utils/subscription-manager';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-info-perso',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    MultiSelectModule,
    CommonModule,
    InputTextModule,
    AvatarModule,
    CustomTagComponent,
    ProfileImgComponent,
    AttachmentFieldComponent,
    ConfirmDialogModule
  ],
  templateUrl: './info-perso.component.html',
  styleUrl: './info-perso.component.scss'
})

export class InfoPersoComponent extends SubscriptionManager implements OnInit, OnDestroy {

  form: UntypedFormGroup;

  editMode: boolean;
  editorDisabled: boolean;

  livreur: InfosLivreur;
  languesOptions: CollectionItem[] = languesOptions;
  isSchedulePanelOpen: boolean;

  persoDefaultImg: string = 'images/default_img.png';
  vehicleDefaultImg: string = 'images/default_img.png';

  permisFileUrl: string | ArrayBuffer | null = null;
  assuranceFileUrl: string | ArrayBuffer | null = null;

  constructor(
    private lCommonService: PLivreurCommonService,
    private routageService: ComponentRoutageService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.livreur = new InfosLivreur({
      img: 'images/capgemini.jpg',
      status: { severity: TagSeverity.SUCCESS, content: "En cours" },
      name: 'Amine',
      lastname: 'Benali',
      immatricule: 'LBX-45723',
      dateInscription: new Date('2023-04-15'),
      langue: [
        { code: 'fr', label: 'Français' },
        { code: 'ar', label: 'Arabe' }
      ],
      horaire: {
        lundi: '08:00 - 18:00',
        mardi: '08:00 - 18:00',
        mercredi: '08:00 - 18:00',
        jeudi: '08:00 - 18:00',
        vendredi: '08:00 - 12:00',
        samedi: '09:00 - 13:00',
        dimanche: 'Off',
      },
      livMail: 'amine.benali@example.com',
      livPhone: '+212 6 12 34 56 78',
      livAdresse: '27 Rue des Palmiers',
      ville: 'Casablanca',
      codePostal: '20000',
      vType: 'Scooter',
      vmatricule: 'SC-2345-CB',
      vImg: null,
      permis: {
        type: 'A1',
        numero: 'PERM-980321-CAS',
        dateObtention: new Date('2019-06-21'),
      },
      assurance: {
        compagnie: 'Wafa Assurance',
        numeroContrat: 'WA-2023-78945',
        validite: {
          debut: new Date('2024-01-01'),
          fin: new Date('2025-01-01')
        }
      }
    });
    this.editorDisabled = true;
    this.initForm();
    this.routageService.selectTab(LivreurSideBar.PERSO);
  }

  initForm() {
    this.form = this.lCommonService.adaptPersoInfoToForm(this.livreur);
    this.assuranceFileUrl = this.form.get('assurance')?.value;
    this.permisFileUrl = this.form.get('permis')?.value;
    this.form.disable();
  }

  toggleEdit() {
    if (!this.editMode) { //le bouton est "Modifier"
      this.form.enable();
      this.editMode = true;
      this.editorDisabled = false;
    } else {   // Le bouton c'est "save"                  
      this.showCloseConfirmation();
    }
  }

  showCloseConfirmation() {
    this.confirmationService.confirm({
      message: this.translate.instant('app.profil.entreprise.administratif.confirmDialog.message'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onReject();
      },
      reject: () => {
        this.onAccept();
      },
      acceptLabel: this.translate.instant('app.common.buttons-label.cancel'),
      rejectLabel: this.translate.instant('app.common.buttons-label.yes'),
      acceptButtonStyleClass: 'cold-button',
      rejectButtonStyleClass: 'p-button-danger',
      closeOnEscape: true,
      dismissableMask: true,
      key: 'closeConfirmation'
    });
  }

  get formattedSchedule() {
    return Object.entries(this.livreur.horaire).map(([day, hours]) => ({
      day: this.capitalizeFirstLetter(day),
      slots: hours === 'Off' ? ['Fermé'] : [hours],
      styleClass: hours === 'Off' ? 'red-slot' : 'green-slot'
    }));
  }

  private capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  toggleSchedulePanel() {
    this.isSchedulePanelOpen = !this.isSchedulePanelOpen;
  }

  cancelEdit() {
    this.editMode = false;
    this.editorDisabled = true;
    this.initForm();
  }

  onEditLivreurImg($event: any) {
    this.editMode = $event.editMode;
  }

  onEditVehicleImg($event: any) {
    this.editMode = $event.editMode;
  }

  saveAssuranceFile($event: any) {
    this.form.get('assurance')?.setValue($event);
  }
  savePermisFile($event: any) {
    this.form.get('permis')?.setValue($event);
  }

  onAccept(): void {
    this.register(

    );
    this.editMode = false;
    this.editorDisabled = true;
    this.form.disable();
  }

  onReject(): void {
    console.log();
  }

  ngOnDestroy(): void {
    this.clean();
  }


}
