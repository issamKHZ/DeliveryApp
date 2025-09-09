import { Component, Input, OnDestroy, OnInit, Type } from '@angular/core';
import { ComponentRoutageService } from '../../../../services/component-routage.service';
import { ComponentsKeyEnum } from '../../../../modele/enumerate/ComponentsKey';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { AutoFocusModule } from 'primeng/autofocus';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ProfilEntrepCommonService } from '../../../../services/profile/entreprise/pEntrepCommon.service';
import { PersonelInfosEntreprise } from '../../../../modele/entreprise/PersonelInfosEntreprise';
import { TagSeverity, CustomTagComponent } from '../../../utils/custom-tag/custom-tag.component';
import { OpenImageDialogService } from '../../../utils/profile-img/open-image-dialog.service';
import { take } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubscriptionManager } from '../../../../utils/subscription-manager';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';
import { trigger, transition, style, animate } from '@angular/animations';
import { LoadingService } from '../../../utils/spinner/loading.service';
import { EntrepSideBar } from '../../../../modele/enumerate/EntrepSideBar';
import { ProfileImgComponent } from "../../../utils/profile-img/profile-img.component";
import { ActivatedRoute } from '@angular/router';
import { ProfileEntrepriseService } from '../../../../services/profile/entreprise/profile-entreprise.service';
import { SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { PhoneNumberDirective } from '../../../../directives/phone-number.directive';
import { FilesService } from '../../../../services/utils/files.service';

export enum PersonelFieldsEnum {
  NAME = "Nom d'entreprise",
  TYPE = "Profil",
  DOC = "Date d'inscription",
  MAIL = "Adresse mail",
  PHONE = "Nº Telephone",
  WEBSITE = "Website"
}

export enum PersonelFieldGroup {
  IDENT,
  CONTACT
}

export interface PersonalInfosField {
  label: string;
  control: FormControl;
  placeholder?: string;
  haschanged: boolean;
  editMode: boolean;
  focus: boolean;
  code: PersonelFieldsEnum;
  originalValue: string;
  firstValue?: string;
  group: PersonelFieldGroup;
}

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    AvatarModule,
    CalendarModule,
    DatePickerModule,
    TagModule,
    FormsModule,
    ReactiveFormsModule,
    RippleModule,
    FluidModule,
    AutoFocusModule,
    AvatarModule,
    CustomTagComponent,
    TranslateModule,
    ProfileImgComponent,
    PhoneNumberDirective
],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' })),
      ]),
    ])
  ]
})
export class GeneralComponent extends SubscriptionManager implements OnInit, OnDestroy {

  readonly defaultImage = 'images/default-entreprise.png';
  initialImage: string;

  tag = TagSeverity;
  personelFieldGroup = PersonelFieldGroup;
  personelFieldsEnum = PersonelFieldsEnum;
  component = ComponentsKeyEnum;

  user: PersonelInfosEntreprise;

  fields: PersonalInfosField[];
  imageEdited: boolean;
  editMode: boolean;

  constructor(
    private routageService: ComponentRoutageService,
    private commonService: ProfilEntrepCommonService,
    private profileService: ProfileEntrepriseService,
    private openImageService: OpenImageDialogService,
    private spinner: LoadingService,
    private route: ActivatedRoute,
    private message: MessageService,
    private translate: TranslateService,
    private fileService: FilesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.routageService.selectTab(EntrepSideBar.GENERAL);
    this.spinner.hide();
    this.routageService.selectComponent(this.component.ENTREPRISE_PROFILE);

    this.commonService.getProfileData().subscribe(data => {
      if (data) {      
        this.user = this.commonService.adaptGeneralDtoToModel(data);                
        this.initialImage = this.user.img;
        if (this.user.img != null) {
          this.user.imgFile = this.fileService.convertStringToFile(this.user.img, "entreprise_img");
        }
        this.fields = this.commonService.adaptPersonalInfoToForm(this.user);
      }
    });
  }

  filterFields(group: PersonelFieldGroup): PersonalInfosField[] {
    return this.fields.filter(field => field.group == group);
  }

  toggleEdit(code: PersonelFieldsEnum): void {
    const field = this.fields.find(f => f.code === code);
    // if (code == PersonelFieldsEnum.PHONE) {
    //   let value = field.control.value;
    //   if (value.length > 20) {
    //     field.control.setValue(value.substring(0, 20));
    //   }
    // }
    if (field) {
      this.fields.map(f => f.focus = false);
      if (!field.editMode) {
        this.editField(field);
      } else {
        this.saveField(field);
      }
    }
  }

  editField(field: PersonalInfosField): void {
    field.focus = true;
    field.editMode = true;
    field.originalValue = field.control.value;
  }

  saveField(field: PersonalInfosField): void {
    let value = field.control.value;

    if (value === '' || value === null || value == field.originalValue) {
      field.control.setValue(field.originalValue);
    } else {
      if (field.code == PersonelFieldsEnum.DOC) { value = this.commonService.formatStringDDMMYYYY(value); }
      if (value !== field.originalValue) {
        field.haschanged = true;
      }
      field.control.setValue(value);
    }
    field.editMode = false;
    this.checkCanEdit();
  }

  onEdit(event: any) {
    this.editMode = event.editMode;
     if (!event.img) {
      this.user.imgFile = null;
      return;
    }    
    this.user.imgFile = this.fileService.convertStringToFile(event.img, "entreprise_img");
    this.user.img = event.img;
  }

  reset(): void {
    this.user = { ...this.user, img: this.initialImage };
    this.fields.map(item => {
      item.control.setValue(item.firstValue);
      item.haschanged = false;
      item.editMode = false;
    });
    this.editMode = false;
  }

  edit(): void {
    if (!this.fields.reduce((acc, curr) => acc && !curr.editMode, true)) {
      this.message.add({
        severity: 'warn', summary: this.translate.instant('app.profil.entreprise.general.errors.cannot-edit.summary'),
        detail: this.translate.instant('app.profil.entreprise.general.errors.cannot-edit.message'), life: 4000
      });
      return;
    }
    if (!this.user.img) {
      this.user.imgFile = null;
    }
    const request = this.commonService.adaptGeneralFieldsToModel(this.fields, this.user.ID, this.user.imgFile);
    this.spinner.show();
    this.profileService.saveGeneralInfos(request).subscribe({
      next: (response: any) => {
        this.commonService.setProfileData(response);
        this.commonService.setEntrepName(response.name);
        this.editMode = false;
        this.spinner.hide();
        this.message.add({
          severity: 'success', summary: this.translate.instant('app.profil.entreprise.general.errors.success-edit.summary'),
          detail: this.translate.instant('app.profil.entreprise.general.errors.success-edit.message'), life: 4000
        })
      },
      error: () => {
        this.message.add({
          severity: 'error', summary: this.translate.instant('app.profil.common-errors.edit-error.summary'),
          detail: this.translate.instant('app.profil.common-errors.edit-error.message'), life: 4000
        })
      }
    })
  }

  checkCanEdit(): void {
    this.editMode = this.fields.some(item => item.haschanged === true);
  }

  ngOnDestroy(): void {
    this.clean();
  }
}