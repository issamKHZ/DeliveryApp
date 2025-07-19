import { Component, OnDestroy, OnInit, Type } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionManager } from '../../../../utils/subscription-manager';
import { CalendarModule } from 'primeng/calendar';
import { DatePickerModule } from 'primeng/datepicker';
import { trigger, transition, style, animate } from '@angular/animations';
import { LoadingService } from '../../../utils/spinner/loading.service';
import { EntrepSideBar } from '../../../../modele/enumerate/EntrepSideBar';
import { ProfileImgComponent } from "../../../utils/profile-img/profile-img.component";

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
    ProfileImgComponent
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


  user: PersonelInfosEntreprise = {
    ID: '340DF16',
    img: null,
    status: { severity: TagSeverity.INFO, content: "En cours" },
    name: "Capgemini",
    Type: "Entreprise",
    doc: "28/09/2000",
    mail: "cpgemini@gmail.com",
    phone: "05 78 23 54 99",
    website: "https://capgemini.com"
  }

  fields: PersonalInfosField[];
  imageEdited: boolean;
  editMode: boolean;

  constructor(
    private routageService: ComponentRoutageService,
    private commonService: ProfilEntrepCommonService,
    private openImageService: OpenImageDialogService,
    private spinner: LoadingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.routageService.selectTab(EntrepSideBar.GENERAL);
    this.spinner.hide();
    this.initialImage = this.user.img;
    this.routageService.selectComponent(this.component.ENTREPRISE_PROFILE);
    this.fields = this.commonService.adaptPersonalInfoToForm(this.user);
  }

  filterFields(group: PersonelFieldGroup): PersonalInfosField[] {
    return this.fields.filter(field => field.group == group);
  }

  toggleEdit(code: PersonelFieldsEnum): void {
    const field = this.fields.find(f => f.code === code);
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
    // check si tous les edit sont off (valdié) avant de commencer


    // apres edit tu dois changer le initial img
  }

  checkCanEdit(): void {
    this.editMode = this.fields.some(item => item.haschanged === true);
  }

  ngOnDestroy(): void {
    this.clean();
  }
}