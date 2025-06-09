import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComponentsKeyEnum } from '../modele/enumerate/ComponentsKey';
import { MenuItem } from 'primeng/api';
import { EntrepSideBar } from '../modele/enumerate/EntrepSideBar';
import { LivreurSideBar } from '../modele/enumerate/LivreurSideBar';
import { ProfileTabs } from '../modele/profileTabs';

@Injectable({
  providedIn: 'root'
})
export class ComponentRoutageService {

  private _component = new BehaviorSubject<ComponentsKeyEnum | null>(null);
  currentComponent$ = this._component.asObservable();

  private _profilTabs = new BehaviorSubject<EntrepSideBar | LivreurSideBar | null>(null);
  currentTab$ = this._profilTabs.asObservable();

  constructor() { }

  selectComponent(key: ComponentsKeyEnum): void {
    this._component.next(key);
  }

  selectTab(key: EntrepSideBar | LivreurSideBar): void {
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
    
  }

  markTabActive(items: ProfileTabs[], selectedTab: EntrepSideBar | LivreurSideBar) {
    for (let item of items) {
      if (item.code === selectedTab) {
        (item as any).isActive = true;
      } else {
        (item as any).isActive = false;
      }      
    }    
  }



}
