import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SubscriptionManager } from '../../../shared/utils/subscription-manager';
import { ComponentRoutageService } from '../../../shared/services/component-routage.service';
import { ComponentsKeyEnum } from '../../../shared/modele/enumerate/ComponentsKey';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from "primeng/tooltip";
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { CollectionItem } from '../../../shared/modele/CollectionItem';
import { OrdersFilterInfosService } from '../../../shared/services/Livraison/Entreprise/http/orders.filter.infos.service';
import { Router } from '@angular/router';
import { RoutesEnum } from '../../../shared/modele/enumerate/routes';
import { MessageService, SortEvent } from 'primeng/api';
import { OrdersFilterService } from '../../../shared/services/Livraison/Entreprise/metier/orders.filter.service';
import { OrderStatus } from '../../../shared/modele/enumerate/OrderStatus';
import { SiegeService } from '../../../shared/services/profile/entreprise/siege/siege.service';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../shared/services/Authentication/auth.service';
import { SiegeHttpService } from '../../../shared/services/profile/entreprise/siege/siege.http.service';
import { LargeContentFieldComponent } from '../../../shared/components/utils/large-content-field/large-content-field.component';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-commandes.entreprise',
  standalone: true,
  imports: [
    LargeContentFieldComponent,
    FormsModule,
    InputTextModule,
    CommonModule,
    TranslateModule,
    ButtonModule,
    PanelModule,
    DatePickerModule,
    InputNumberModule,
    SelectModule,
    TableModule,
    Tooltip,
    RippleModule
  ],
  templateUrl: './commandes.entreprise.component.html',
  styleUrl: './commandes.entreprise.component.scss'
})
export class CommandesEntrepriseComponent extends SubscriptionManager implements OnInit, OnDestroy {

  searchID: string;
  searchStatus: string = OrderStatus.DEF;
  searchDatePub: any;
  searchDateLiv: any;
  searchRetrait: any;
  searchCityLiv: any;
  searchWeight: any;
  searchNum: any;
  searchModeLiv: string = OrderStatus.DEF;

  entrepriseId: string;

  orderStatusOptions: CollectionItem[];
  orderModesOptions: CollectionItem[];
  cities: any[];
  sites: any[];

  siegesTypes: CollectionItem[];
  dataLoading: boolean;

  @ViewChild('dt1') dt: Table;

  products: any[];
  initialValue: any[];
  isSorted: boolean = null;


  constructor(
    private routageService: ComponentRoutageService,
    private orderFilterInfos: OrdersFilterInfosService,
    private orderHelperService: OrdersFilterService,
    private sitesHttpService: SiegeHttpService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService,
    private message: MessageService,
    public siegeService: SiegeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.routageService.selectComponent(ComponentsKeyEnum.M_ORDERS_ENTREPRISE);
    this.authService.getCurrentUserId()
      .then((id: string) => {
        this.entrepriseId = id;
        this.loadData();
      })
      .catch(err => console.error(err));
  }

  private loadData(): void {
    this.dataLoading = true;
    this.register(
      forkJoin({
        statuses: this.orderFilterInfos.getOrderStatus(),
        modes: this.orderFilterInfos.getOrderModes(),
        cities: this.orderFilterInfos.getCities(),
        sites: this.orderFilterInfos.getEntrepriseSites(this.entrepriseId),
        types: this.sitesHttpService.getSitesTypes()
      }).subscribe({
        next: ({ statuses, modes, cities, sites, types }) => {
          this.orderStatusOptions = this.orderHelperService.formatItem(statuses);
          this.orderModesOptions = this.orderHelperService.formatItem(modes);
          this.cities = this.siegeService.adaptCitiesOptions(cities);
          this.sites = sites;
          this.siegesTypes = types;
          this.dataLoading = false;
        },
        error: () => this.handleError()
      })
    );
  }

  private handleError(): void {
    this.message.add({
      severity: 'error',
      summary: this.translate.instant('app.entreprise.mes-commandes.filters.messages.header'),
      detail: this.translate.instant('app.entreprise.mes-commandes.filters.messages.global-error'),
      life: 4000
    });
    this.router.navigate([RoutesEnum.ERROR]);
  }

  cleanFilters(): void {
    this.searchID = null;
    this.searchStatus = OrderStatus.DEF;
    this.searchModeLiv = OrderStatus.DEF;
    this.searchDatePub = null;
    this.searchDateLiv = null;
    this.searchRetrait = null;
    this.searchCityLiv = null;
    this.searchWeight = null;
    this.searchNum = null;
  }

  getLabelByCollectionCode(code: string): string {
    let subTypes = this.siegesTypes.filter(t => t.code == code);
    if (subTypes.length != 0) {
      return subTypes[0].label;
    }
    return code;
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
      this.products = [...this.initialValue];
      this.dt.reset();
    }
  }

  sortTableData(event: any) {
    event.data.sort((data1: any, data2: any) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;
      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }

  ngOnDestroy(): void {
    this.clean();
  }
}
