import { Injectable } from '@angular/core';
import { CollectionItem } from '../../../../modele/CollectionItem';
import { OrderStatus } from '../../../../modele/enumerate/OrderStatus';
import { TranslateService } from '@ngx-translate/core';
import { OrderMode } from '../../../../modele/enumerate/orderMode';

@Injectable({
  providedIn: 'root'
})
export class OrdersFilterService {


  constructor(private translate: TranslateService) { }

  formatLabel(status: string): string {
    const labelMap: Record<string, string> = {
      [OrderStatus.NA]: this.translate.instant("app.entreprise.mes-commandes.filters.order.status.na"),
      [OrderStatus.LEC]: this.translate.instant("app.entreprise.mes-commandes.filters.order.status.lec"),
      [OrderStatus.AS]: this.translate.instant("app.entreprise.mes-commandes.filters.order.status.as"),
      [OrderStatus.LV]: this.translate.instant("app.entreprise.mes-commandes.filters.order.status.lv"),
      [OrderStatus.ANN]: this.translate.instant("app.entreprise.mes-commandes.filters.order.status.ann"),
      [OrderStatus.RAT]: this.translate.instant("app.entreprise.mes-commandes.filters.order.status.rat"),
      [OrderStatus.DEF]: this.translate.instant("app.entreprise.mes-commandes.filters.order.status.def"),
      [OrderMode.SC]: this.translate.instant("app.entreprise.mes-commandes.filters.order.mode.sc"),
      [OrderMode.BC]: this.translate.instant("app.entreprise.mes-commandes.filters.order.mode.bc")
    };

    return labelMap[status] || status;
  }

  formatItem(items: CollectionItem[]): CollectionItem[] {
    let result = items.map(i => {
      return {
        code: i.code,
        label: this.formatLabel(i.code)
      }
    })
    result.unshift({ code: OrderStatus.DEF, label: this.formatLabel(OrderStatus.DEF) });
    return result;
  }

}