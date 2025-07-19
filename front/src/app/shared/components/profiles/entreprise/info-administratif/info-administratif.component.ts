import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { EditorModule } from 'primeng/editor';
import { ProfilEntrepCommonService } from '../../../../services/profile/entreprise/pEntrepCommon.service';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { secteursList } from '../../../../constants/entrepConstants';
import { AdminInfoEntreprise } from '../../../../modele/entreprise/AdminInfoEntreprise';
import { FileSelectEvent, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { CommonModule, NgIf } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SubscriptionManager } from '../../../../utils/subscription-manager';
import { ComponentRoutageService } from '../../../../services/component-routage.service';
import { EntrepSideBar } from '../../../../modele/enumerate/EntrepSideBar';
import { ProfileEntrepriseService } from '../../../../services/profile/entreprise/profile-entreprise.service';
import { LoadingService } from '../../../utils/spinner/loading.service';
import { AttachmentFieldComponent } from "../../../utils/attachment-field/attachment-field.component";

@Component({
  selector: 'app-info-administratif',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    TranslateModule,
    PanelModule,
    EditorModule,
    ButtonModule,
    MultiSelectModule,
    FileUploadModule,
    ConfirmDialogModule,
    CommonModule,
    AttachmentFieldComponent
  ],
  templateUrl: './info-administratif.component.html',
  styleUrl: './info-administratif.component.scss'
})
export class InfoAdministratifComponent extends SubscriptionManager implements OnInit, OnDestroy {

  secteursList: { label: string, code: string }[];
  form: UntypedFormGroup;
  editorDisabled: boolean;
  editMode: boolean;

  userInfos: AdminInfoEntreprise = {
    responsableName: "hicham yahyaoui",
    responsableEmail: "hicham.yahyaoui@gmail.com",
    responsablePhone: "05 69 12 45 86",
    adress: "182 rue jrada bensamin",
    postalCode: "44000",
    city: "Rabat",
    country: "Maroc",
    justificatifDomicil: null,
    siretNumber: "458 744 254 25",
    activitySector: ['coursiers', 'commerce', 'logistique'],
    description: "Lorem upsum kdpc zpockzc pozckzlc oc,eocezc poc,pcezpc pz,cpez,cpz czpdc,pzc,z,"
  }

  fileUrl: string | ArrayBuffer | null = null;



  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private commonService: ProfilEntrepCommonService,
    private routageService: ComponentRoutageService,
    private spinner: LoadingService,
    private confirmationService: ConfirmationService) {
    super();
  }

  ngOnInit(): void {
    this.routageService.selectTab(EntrepSideBar.ADMIN);
    this.initForm();
    this.editorDisabled = true;
    this.secteursList = secteursList;
  }

  initForm(): void {
    this.form = this.commonService.adaptAdministratifInfoToForm(this.userInfos);
    this.fileUrl = this.form.get('justificatif')?.value;
    this.form.disable();
  }


  scrollDown() {
    this.commonService.autoScroll(true);
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

  saveFile($event: any) {
    this.form.get('justificatif')?.setValue($event);
  }

  private showCloseConfirmation(): void {
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

  cancelEdit() {
    this.editMode = false;
    this.editorDisabled = true;
    this.initForm();
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
