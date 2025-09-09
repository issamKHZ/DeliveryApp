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
import { AvatarModule } from 'primeng/avatar';
import { CustomTagComponent } from '../../../utils/custom-tag/custom-tag.component';
import { ComponentRoutageService } from '../../../../services/component-routage.service';
import { LivreurSideBar } from '../../../../modele/enumerate/LivreurSideBar';
import { ProfileImgComponent } from '../../../utils/profile-img/profile-img.component';
import { AttachmentFieldComponent } from '../../../utils/attachment-field/attachment-field.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SubscriptionManager } from '../../../../utils/subscription-manager';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LivScheduleDialogComponent } from '../../../dialogs/liv-schedule-dialog/liv-schedule-dialog.component';
import { Days } from '../../../../modele/enumerate/Days';
import { ScheduleLine } from '../../../../modele/scheduleLine';
import { ProfileLivreurService } from '../../../../services/profile/livreur/profile-livreur.service';
import { CommonService } from '../../../../services/utils/common.service';
import { SelectModule } from 'primeng/select';
import { FilesService } from '../../../../services/utils/files.service';
import { forkJoin, take } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { FieldsetModule } from 'primeng/fieldset';
import { InputMaskModule } from 'primeng/inputmask';
import { LoadingService } from '../../../utils/spinner/loading.service';
import { FourDigitSpacerDirective } from '../../../../directives/four-digit-spacer.directive';

@Component({
  selector: 'app-info-perso',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    MultiSelectModule,
    SelectModule,
    CommonModule,
    InputTextModule,
    // InputNumberModule,
    InputMaskModule,
    FieldsetModule,
    AvatarModule,
    CustomTagComponent,
    ProfileImgComponent,
    AttachmentFieldComponent,
    InputNumberModule,
    ConfirmDialogModule,
  ],
  templateUrl: './info-perso.component.html',
  styleUrl: './info-perso.component.scss'
})

export class InfoPersoComponent extends SubscriptionManager implements OnInit, OnDestroy {



  form: UntypedFormGroup;

  editMode: boolean;
  editorDisabled: boolean;

  livreur: InfosLivreur;
  languesOptions: CollectionItem[];
  isSchedulePanelOpen: boolean;

  persoDefaultImg: string = 'images/default_img.png';
  vehicleDefaultImg: string = 'images/default_img.png';

  permisFileUrl: string | ArrayBuffer | null = null;
  assuranceFileUrl: string | ArrayBuffer | null = null;

  ref: DynamicDialogRef;
  vehiclesOptions: CollectionItem[];

  constructor(
    private commonService: PLivreurCommonService,
    private appService: CommonService,
    private fileService: FilesService,
    private routageService: ComponentRoutageService,
    private livreurService: ProfileLivreurService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private dynamicDialog: DialogService,
    private message: MessageService,
    private spinner: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.register(
      forkJoin([
        this.livreurService.getLangues(),
        this.livreurService.getVehicles()
      ]).subscribe(([langues, vehicles]) => {
        this.languesOptions = langues;
        this.vehiclesOptions = vehicles;
      }),

      this.commonService.getProfileData().subscribe(data => {
        if (data) {
          this.processLivreur(data);

          this.editorDisabled = true;
          this.initForm();
          this.routageService.selectTab(LivreurSideBar.PERSO);
        }
      })
    );
  }

  private processLivreur(data: any): void {
    this.livreur = data;
    this.livreur.status.content = this.appService.getContextByCode(data.status.code);
    this.livreur.status.severity = this.appService.getSeverityByCode(data.status.severity);
    this.processImages();
    this.processFiles();
    this.processSchedule();
  }

  processSchedule() {
    if (this.livreur.horaires == null) {
      this.livreur.horaires = this.commonService.initSchedule();
    }
  }

  private processImages(): void {
    this.livreur.profilImgStr = this.livreur.profilImgResult ? this.fileService.createImageUrl(this.livreur.profilImgResult.fileContents, this.livreur.profilImgResult.contentType) : null
    if (this.livreur.profilImgStr != null) {
      this.livreur.profilImg = this.fileService.convertStringToFile(this.livreur.profilImgStr, "livreur_img");
    }
    this.livreur.vehicleImgStr = this.livreur.vehicleImgResult ? this.fileService.createImageUrl(this.livreur.vehicleImgResult.fileContents, this.livreur.vehicleImgResult.contentType) : null
    if (this.livreur.vehicleImgStr != null) {
      this.livreur.vehicleImg = this.fileService.convertStringToFile(this.livreur.vehicleImgStr, "vehicle_img");
    }
  }

  private processFiles(): void {
    if (this.livreur.assuranceResult != null) {
      this.livreur.assuranceStr = this.fileService.createFileUrl(this.livreur.assuranceResult.fileContents, this.livreur.assuranceResult.contentType);
      this.livreur.assuranceDownloadName = this.livreur.assuranceResult.fileDownloadName;
      this.livreur.assurance = this.fileService.convertStringToFile(this.livreur.assuranceStr, this.livreur.assuranceDownloadName)
    }

    if (this.livreur.permisResult != null) {
      this.livreur.permisStr = this.fileService.createFileUrl(this.livreur.permisResult.fileContents, this.livreur.permisResult.contentType);
      this.livreur.permisDownloadName = this.livreur.permisResult.fileDownloadName;
      this.livreur.permis = this.fileService.convertStringToFile(this.livreur.permisStr, this.livreur.permisDownloadName)
    }
  }

  initForm() {
    this.form = this.commonService.adaptPersoInfoToForm(this.livreur);
    this.assuranceFileUrl = this.form.get('assurance')?.value;
    this.permisFileUrl = this.form.get('permis')?.value;
    this.form.disable();
  }

  toggleEdit() {
    if (!this.editMode) {
      this.ennableForm();
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

  formattedSchedule() {
    const days = Object.values(Days);
    let result = days.map(d => {
      const slot = this.livreur.horaires?.find(h => h.day === d.toString());

      // Vérifier si le slot existe et a des heures définies
      if (slot && slot.startHour && slot.endHour) {
        return this.configureSchedule(slot);
      } else if (slot && slot.dispo) {
        return {
          day: this.translateDays(d),
          slot: this.translate.instant('app.profil.livreur.info-perso.schedule.dispos.free'),
          styleClass: "green-slot"
        };
      } else {
        return {
          day: this.translateDays(d),
          slot: this.translate.instant('app.profil.livreur.info-perso.schedule.dispos.indispo'),
          styleClass: "red-slot"
        };
      }
    });
    return result;
  }

  configureSchedule(slot: ScheduleLine) {
    return {
      day: this.translateDays(slot.day),
      slot: slot.dispo === false ? this.translate.instant('app.profil.livreur.info-perso.schedule.dispos.indispo') : `${this.formatTimeWithH(slot.startHour)} - ${this.formatTimeWithH(slot.endHour)}`,
      styleClass: slot.dispo === false ? 'red-slot' : 'green-slot'
    };
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
    if (!$event.img) {
      this.livreur.profilImg = null;
      return;
    }

    this.livreur.profilImg = this.fileService.convertStringToFile($event.img, "liv_profile");
  }

  onEditVehicleImg($event: any) {
    this.editMode = $event.editMode;
    if (!$event.img) {
      this.livreur.vehicleImg = null;
      return;
    }
    const blob = this.fileService.dataURLtoBlob($event.img);
    const file = new File([blob], 'liv_profile.png', { type: this.fileService.extractMimeType($event.img) });
    this.livreur.vehicleImg = file;
  }

  saveAssuranceFile($event: any) {
    this.form.get('assurance')?.setValue($event?.file);
    if ($event == null) {
      this.livreur.assurance = null;
    }
    this.livreur.assurance = this.fileService.convertStringToFile($event.file, $event.name);
  }
  savePermisFile($event: any) {
    this.form.get('permis')?.setValue($event?.file);
    if ($event == null) {
      this.livreur.permis = null;
    }
    this.livreur.permis = this.fileService.convertStringToFile($event.file, $event.name);
  }

  onAccept(): void {
    let livreurDto = this.commonService.adaptFormToPersonal(this.form,
      this.livreur.profilImg,
      this.livreur.vehicleImg,
      this.livreur.assurance,
      this.livreur.permis,
      this.livreur.horaires
    );

    // const rib = this.form.get("rib")?.value;
    // if ((rib != "" && rib != null) && !/^[A-Z]{2}[0-9 ]*$/.test(rib)) {
    //   this.message.add({
    //     severity: 'error', summary: this.translate.instant('app.profil.livreur.info-perso.errors.rib-not-valid.summary'),
    //     detail: this.translate.instant('app.profil.livreur.info-perso.errors.rib-not-valid.message'), life: 4000
    //   });
    //   return;
    // }

    this.spinner.show();
    this.register(
      this.livreurService.saveLivreurProfil(livreurDto).subscribe({
        next: (response) => {
          this.commonService.setProfileData(response);
          this.spinner.hide();
          this.message.add({
            severity: 'success', summary: this.translate.instant('app.profil.entreprise.general.errors.success-edit.summary'),
            detail: this.translate.instant('app.profil.entreprise.general.errors.success-edit.message'), life: 4000
          })
        },
        error: (error) => {
          this.spinner.hide();
          if (error.status == HttpStatusCode.BadRequest) {
            if (error.errors.Phone) {
              this.message.add({
                severity: 'error', summary: this.translate.instant('app.profil.livreur.info-perso.errors.phone-required.summary'),
                detail: this.translate.instant('app.profil.livreur.info-perso.errors.phone-required.message'), life: 4000
              });
            }
            if (error.errors.Name || error.errors.Lastname) {
              this.message.add({
                severity: 'error', summary: this.translate.instant('app.profil.livreur.info-perso.errors.fullname-required.summary'),
                detail: this.translate.instant('app.profil.livreur.info-perso.errors.fullname-required.message'), life: 4000
              });
            }
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

  editSchedule() {
    this.ref = this.dynamicDialog.open(LivScheduleDialogComponent, {
      // header: this.translate.instant('app.profil.entreprise.sieges.dialog.header'),
      width: '28vw',
      closable: true,
      focusOnShow: false,
      modal: true,
      closeOnEscape: false,
      dismissableMask: false,
      data: {
        scheduleData: this.livreur.horaires
      }
    });

    this.ref.onClose.pipe(
      take(1)
    ).subscribe((resp: ScheduleLine[]) => {
      if (resp) {
        this.livreur.horaires = resp;
      }
    });
  }
  ennableForm(): void {
    this.form.enable();
    this.form.get("immatricule").disable();
    this.form.get("dateInscription").disable();
    this.form.get("livMail").disable();
  }

  translateDays(day: string): string {

    const dayKeys = [
      'monday', 'tuesday', 'wednesday', 'thursday',
      'friday', 'saturday', 'sunday'
    ];

    let days = dayKeys.map((key, index) => ({
      day: Object.values(Days)[index],
      translate: this.translate.instant(`app.profil.livreur.info-perso.schedule.days.${key}`)
    }));

    return days.find(d => d.day == day).translate;
  }

  formatTimeWithH(dateInput: string | Date): string {
    // Convertir en Date si c'est une string
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Objet Date invalide:', dateInput);
      return '';
    }

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}h${minutes}`;
  }


  ngOnDestroy(): void {
    this.clean();
  }
}


