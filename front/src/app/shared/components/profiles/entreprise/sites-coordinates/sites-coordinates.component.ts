import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { siegesList, SiegesStatus, SiegesTypes } from '../../../../constants/entrepConstants';
import { LargeContentFieldComponent } from "../../../utils/large-content-field/large-content-field.component";
import { CustomTagComponent, TagSeverity } from "../../../utils/custom-tag/custom-tag.component";
import { ButtonModule } from 'primeng/button';
import { SortEvent } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { DigitSpacerLimitedDirective } from '../../../../directives/digit-spacer-limited.directive';
import { InputGroupModule } from 'primeng/inputgroup';
import { CustomSpeedDialComponent } from "../../../utils/custom-speed-dial/custom-speed-dial.component";
import { SiegeService } from '../../../../services/profile/entreprise/siege/siege.service';
import { Sieges } from '../../../../modele/entreprise/Sieges';
import { SubscriptionManager } from '../../../../utils/subscription-manager';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';

export enum SpeedDialActionsEnum {
  ADD,
  EDIT,
  DELETE,
  EXPORT
}

export interface SpeedDialAction {
  label: string;
  code: SpeedDialActionsEnum;
  icon: string;
  tooltip?: string;
  emptyCommand?: () => void;
  command?: (param?: any) => void;
}

@Component({
  selector: 'app-sites-coordinates',
  styleUrl: './sites-coordinates.component.scss',
  templateUrl: './sites-coordinates.component.html',
  standalone: true,
  imports: [
    RadioButtonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    MultiSelectModule,
    SelectModule,
    CommonModule,
    TranslateModule,
    LargeContentFieldComponent,
    CustomTagComponent,
    ToggleSwitchModule,
    ToggleButtonModule,
    InputGroupModule,
    SkeletonModule,
    DigitSpacerLimitedDirective,
    ButtonModule,
    CustomSpeedDialComponent,
    RippleModule
  ],
  providers: []
})
export class SitesCoordinatesComponent extends SubscriptionManager implements OnInit, OnDestroy {


  isValid(_t178: any) {
    throw new Error('Method not implemented.');
  }
  cancelRowEdit(_t178: any) {
    throw new Error('Method not implemented.');
  }
  

  checkedSiegeToEditId: string;

  customers!: any[];
  sieges: Sieges[];
  selectedSieges: Sieges[];
  editedSieges: Sieges[] = [];
  initialValue: any[];
  typesOptions!: any[];
  statusOptions!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];

  isSorted: boolean = null;
  isFiltring: boolean;
  toggleFilterDisabled: boolean;

  filterForm: FormGroup;

  @ViewChild('dt1') dt1!: Table;
  globalFilterValue: string = '';

  actions: SpeedDialAction[];

  visible: boolean;
  isMobile: boolean = false;
  deleteMode: boolean;
  editMode: boolean;

  selectedSiege: any;
  defaultFormModule: boolean = false;

  constructor(private fb: FormBuilder, private translate: TranslateService, private siegeService: SiegeService) {

    super();

    this.filterForm = this.fb.group({
      filter_type: [null],
      filter_adresse: [''],
      filter_villePays: [''],
      filter_status: [null],
      filter_email: [''],
      filter_phone: [''],
      toggleInit: [false],
      filter_fournisseur: [null]
    });
  }
  ngOnInit() {
    this.loadSieges();
    this.loading = false;
    this.customers = [];
    this.initialValue = [...this.sieges];
    this.typesOptions = SiegesTypes;
    this.statusOptions = SiegesStatus;
    this.toggleFilterDisabled = true;

    this.filterForm.valueChanges.subscribe(values => {
      this.applyFilters();
    });

    this.actions = [
      { code: SpeedDialActionsEnum.ADD, label: this.translate.instant('app.profil.entreprise.sieges.actions.add.label'), icon: 'pi pi-plus', tooltip: this.translate.instant('app.profil.entreprise.sieges.actions.add.tooltip'), emptyCommand: () => { this.siegeService.openAddDialog() } },
      { code: SpeedDialActionsEnum.EDIT, label: this.translate.instant('app.profil.entreprise.sieges.actions.edit.label'), icon: 'pi pi-pencil', tooltip: this.translate.instant('app.profil.entreprise.sieges.actions.edit.tooltip'), emptyCommand: () => { } },
      { code: SpeedDialActionsEnum.DELETE, label: this.translate.instant('app.profil.entreprise.sieges.actions.delete.label'), icon: 'pi pi-trash', tooltip: this.translate.instant('app.profil.entreprise.sieges.actions.delete.tooltip'), command: (selectedSieges: Sieges[]) => { this.siegeService.deleteSelection(selectedSieges) } },
      { code: SpeedDialActionsEnum.EXPORT, label: this.translate.instant('app.profil.entreprise.sieges.actions.export.label'), icon: 'pi pi-external-link', tooltip: this.translate.instant('app.profil.entreprise.sieges.actions.export.tooltip'), emptyCommand: () => { } }
    ];

    this.register(
      this.siegeService.showSelection$.subscribe(
        res => {
          this.deleteMode = res
          this.editMode = res
        }
      ),

      this.siegeService.closeSpeedDial$.subscribe(
        res => {
          if (res) {
            let actualSiege = this.sieges.find(s => s.id == this.checkedSiegeToEditId);
            if (actualSiege) {
              actualSiege.editing = false;
              actualSiege.editStorage = null;
            }

            this.checkedSiegeToEditId = null;
          }
        }
      )
    )

    this.visible = false;
    this.checkScreenSize();
  }

  loadSieges(): void {
    this.sieges = siegesList;
  }

  applyFilters() {
    this.isFiltring = true;

    setTimeout(() => {
      const filters = this.filterForm.value;

      this.dt1.clear();

      if (filters.filter_type) {
        this.dt1.filter(filters.filter_type, 'type.code', 'equals');
      }
      if (filters.filter_adresse) {
        this.dt1.filter(filters.filter_adresse, 'adresse', 'contains');
      }
      if (filters.filter_villePays) {
        this.dt1.filter(filters.filter_villePays, 'villePays', 'contains');
      }
      if (filters.filter_status) {
        this.dt1.filter(filters.filter_status, 'status.code', 'equals');
      }
      if (filters.filter_email) {
        this.dt1.filter(filters.filter_email, 'email', 'contains');
      }
      if (filters.filter_phone) {
        this.dt1.filter(filters.filter_phone, 'phone', 'contains');
      }
      if (filters.filter_fournisseur !== null) {
        this.dt1.filter(filters.filter_fournisseur, 'isDest', 'equals');
      }

      setTimeout(() => {
        this.isFiltring = false;
      }, 300);
    });
  }


  clear(table: Table) {
    this.toggleFilterDisabled = true;
    this.isSorted = null;
    this.sieges = [...this.initialValue];
    table.clear();
    this.globalFilterValue = '';
    this.filterForm.reset();
    this.dt1.reset();
  }

  onFilterGlobal(event: Event) {
    this.isFiltring = true;
    setTimeout(() => {
      const input = event.target as HTMLInputElement;
      this.dt1.filterGlobal(input.value, 'contains');
      setTimeout(() => {
        this.isFiltring = false;
      }, 300);
    });
  }

  getSeverity(status: string): TagSeverity {
    switch (status) {
      case 'CLSDT':
        return TagSeverity.DANGER;
      case 'ACT':
        return TagSeverity.SUCCESS;
      case 'MTN':
        return TagSeverity.WARN;
      default:
        return null;
    }
  }

  customSort(event: SortEvent) {
    if (this.isSorted == null || this.isSorted === undefined) {
      this.isSorted = true;
      this.sortTableData(event);
    } else if (this.isSorted == true) {
      this.isSorted = false;
      this.sortTableData(event);
    } else if (this.isSorted == false) {
      this.isSorted = null;
      this.sieges = [...this.initialValue];
      this.dt1.reset();
    }
  }

  sortTableData(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else if (value1?.label != null && value2?.label != null) result = value1.label.localeCompare(value2.label);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  getDestMotif(dest: boolean): string {
    return dest ? this.translate.instant('app.profil.entreprise.sieges.table.content.values.destinataire') : this.translate.instant('app.profil.entreprise.sieges.table.content.values.fournisseur')
  }

  detectToggleFilter() {
    this.toggleFilterDisabled = false;
    this.filterForm.get('filter_fournisseur').setValue(true);
  }

  onItemClick(event: any) {
    if (event.item.code == SpeedDialActionsEnum.DELETE) {      
      
      this.deleteMode = true;
      if (!event.action) {
        this.selectedSieges = [];
      }
      if (event.action == 'Delete' && this.selectedSieges) {
        event.item.command(this.selectedSieges);
      }
    }
    if (event.item.code == SpeedDialActionsEnum.EDIT) {
      this.editMode = true
      this.selectedSieges = [];      
      if (event.action) {
        let motif = event.action;
        console.log(this.selectedSiege);
        
      }
    }    

    if (event.item.emptyCommand) {
      event.item.emptyCommand();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 1310;
  }

  clearToggleFilter() {
    this.toggleFilterDisabled = true;
    this.filterForm.get('filter_fournisseur').setValue(null);
    this.filterForm.get('toggleInit').setValue(null);
    this.applyFilters();
  }

  onRowSelect(siege: Sieges): void {
    if (!this.editMode) return;

    let actualSiege = this.sieges.find(s => s.id == this.checkedSiegeToEditId);
    if (actualSiege) {
      actualSiege.editing = false;
      actualSiege.editStorage = null;
    }

    this.checkedSiegeToEditId = siege.id;
    siege.editing = true;    

    // Créez une copie pour l'édition
    siege.originalData = { ...siege };

    this.selectedSiege = siege;
  }

  saveRowEdit() {
    let actualSiege = this.sieges.find(s => s.id == this.checkedSiegeToEditId);
    if (actualSiege) {
      actualSiege.editing = false;
      actualSiege.editStorage = null;
    }
    this.checkedSiegeToEditId = null;
  }

  

  ngOnDestroy(): void {
    this.clean();
  }
}