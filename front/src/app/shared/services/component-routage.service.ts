import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComponentsKeyEnum } from '../modele/enumerate/ComponentsKey';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ComponentRoutageService {

  private _component = new BehaviorSubject<ComponentsKeyEnum | null>(null);
  currentComponent$ = this._component.asObservable();

  private _profilTabs = new BehaviorSubject<ComponentsKeyEnum | null>(null);
  currentTab$ = this._profilTabs.asObservable();

  constructor() { }

  selectComponent(key: ComponentsKeyEnum): void {
    this._component.next(key);
  }

  selectTab(key: ComponentsKeyEnum): void {
    this._profilTabs.next(key);
  }

  findMenuItemByComponentKey(items: MenuItem[], key: ComponentsKeyEnum): MenuItem | null {
    for (const item of items) {
      if ((item as any).component === key) {
        return item;
      } else if (item.items) {
        const found = this.findMenuItemByComponentKey(item.items, key);
        if (found) return found;
      }
    }
    return null;
  }

  markActive(items: MenuItem[], selectedComponent: ComponentsKeyEnum) {
    for (let item of items) {
      if ((item as any).component === selectedComponent) {
        (item as any).styleClass = 'active-item';
      } else {
        (item as any).styleClass = '';
      }
      if (item.items) this.markActive(item.items, selectedComponent);
    }
    console.log(items);
    
  }

  markTabActive(items: MenuItem[], selectedTab: ComponentsKeyEnum) {
    for (let item of items) {
      if ((item as any).component === selectedTab) {
        (item as any).styleClass = 'active-item';
      } else {
        (item as any).styleClass = '';
      }
      if (item.items) this.markTabActive(item.items, selectedTab);
    }
    console.log(items);
    
  }



}
