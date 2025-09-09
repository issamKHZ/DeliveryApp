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
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SubscriptionManager } from '../../../../utils/subscription-manager';
import { ComponentRoutageService } from '../../../../services/component-routage.service';
import { EntrepSideBar } from '../../../../modele/enumerate/EntrepSideBar';
import { LoadingService } from '../../../utils/spinner/loading.service';
import { AttachmentFieldComponent } from "../../../utils/attachment-field/attachment-field.component";
import { ActivatedRoute, Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { ProfileEntrepriseService } from '../../../../services/profile/entreprise/profile-entreprise.service';
import { CommonService } from '../../../../services/utils/common.service';
import { FilesService } from '../../../../services/utils/files.service';
import { PhoneNumberDirective } from '../../../../directives/phone-number.directive';
import { HttpStatusCode } from '@angular/common/http';

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
    MessageModule,
    CommonModule,
    PhoneNumberDirective,
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

  userInfos: AdminInfoEntreprise;

  fileUrl: string | ArrayBuffer | null = null;
  initialFile: any;
  initialUrl: any;



  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private commonService: ProfilEntrepCommonService,
    private appService: CommonService,
    private fileService: FilesService,
    private profileService: ProfileEntrepriseService,
    private routageService: ComponentRoutageService,
    private spinner: LoadingService,
    private message: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {    
    this.spinner.show();
    this.routageService.selectTab(EntrepSideBar.ADMIN);
    this.register(

      this.profileService.getSectorActivities().subscribe((response) => {
        this.secteursList = response;
        this.spinner.hide()
      }),

      this.commonService.getProfileData().subscribe(data => {
        if (data) {
          this.userInfos = this.commonService.adaptAdminDtoToModel(data);
          this.fileUrl = this.userInfos.justificatifDomicil;
          this.initialUrl = this.fileUrl;
          if (this.fileUrl) {
            this.userInfos.domicileFile = this.fileService.convertStringToFile(this.fileUrl, this.userInfos.fileDownloadName);
          }
        }
        this.initForm();
        this.editorDisabled = true;
      })

    )
  }

  get displayCompletingError() {
    const requiredFields = ['responsable',
      'remail',
      'rphone',
      'eadresse',
      'epostal',
      'ecity',
      'ecountry',
      'justificatif',
      'siret'];
    return !this.commonService.areRequiredFieldsFilled(this.form, requiredFields);
  }

  initForm(): void {
    this.form = this.commonService.adaptAdministratifInfoToForm(this.userInfos);
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
    this.initialFile = this.userInfos.domicileFile;
    this.initialUrl = this.userInfos.justificatifDomicil;
    this.form.get('justificatif')?.setValue($event?.file);
    if ($event == null) {
      this.userInfos.domicileFile = null;
      return;
    }
    this.userInfos.domicileFile = this.fileService.convertStringToFile($event.file, $event.name);
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
    this.userInfos.domicileFile = this.initialFile;
    this.fileUrl = this.initialUrl;
    this.initForm();
  }

  onAccept(): void {
    let data = this.commonService.adaptFormToAdministratifInfo(this.form, this.userInfos.iD, this.userInfos.domicileFile);
    this.register(
      this.profileService.saveAdminInfos(data).subscribe({
        next: (response) => {
          this.userInfos = this.commonService.adaptAdminDtoToModel(response);
          this.commonService.setProfileData(response);
          this.message.add({
            severity: 'success', summary: this.translate.instant('app.profil.entreprise.general.errors.success-edit.summary'),
            detail: this.translate.instant('app.profil.entreprise.general.errors.success-edit.message'), life: 4000
          })
        },
        error: (error) => {       
          if (error.status == HttpStatusCode.BadRequest) {
            this.message.add({
              severity: 'error', summary: this.translate.instant('app.profil.entreprise.administratif.errors.responsable.summary'),
              detail: this.translate.instant('app.profil.entreprise.administratif.errors.responsable.message'), life: 7000
            })
          }
          this.initForm();
        }
      })
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
