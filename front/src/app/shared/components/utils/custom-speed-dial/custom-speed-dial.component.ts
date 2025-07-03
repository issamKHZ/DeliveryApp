import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener, OnInit, TemplateRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { SpeedDialAction, SpeedDialActionsEnum } from '../../profiles/entreprise/sites-coordinates/sites-coordinates.component';
import { SiegeService } from '../../../services/profile/entreprise/siege/siege.service';


export enum SpeedDialStates {
  CLOSED,
  ALLACTIONS,
  ACTIONCHOOSED
}

@Component({
  selector: 'app-speed-dial',
  templateUrl: './custom-speed-dial.component.html',
  styleUrls: ['./custom-speed-dial.component.scss'],
  standalone: true,
  imports: [CommonModule, RippleModule, TooltipModule, ButtonModule]
})
export class CustomSpeedDialComponent implements OnInit {

  @Input() direction: 'up' | 'down' | 'left' | 'right' = 'right';
  @Input() buttonStyle: any = {};
  @Input() buttonClassName: string = 'speed-dial-button-init';
  @Input() buttonIcon: string = 'pi pi-plus';
  @Input() showIcon: string = 'pi pi-undo px-2';
  @Input() hideIcon: string = 'pi pi-times px-2';
  @Input() radius: number = 0;
  @Input() transitionDelay: number = 30;
  @Input() type: 'linear' | 'circle' | 'semi-circle' | 'quarter-circle' = 'linear';
  @Input() mask: boolean = false;
  @Input() items: any[] = [];
  @Input() visible: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onButtonClick = new EventEmitter<Event>();
  @Output() onItemClick = new EventEmitter<any>();

  SpeedDialStates = SpeedDialStates;
  SpeedDialActionEnum = SpeedDialActionsEnum;

  middleState: SpeedDialStates = SpeedDialStates.CLOSED;
  @Input() selectedActionContent: TemplateRef<any> | null = null;

  selectedAction: SpeedDialAction | null = null;

  get maskStyle() {
    return {
      display: this.mask && this.visible ? 'block' : 'none'
    };
  }

  get buttonLabelClass() {
    switch (this.middleState) {
      case SpeedDialStates.CLOSED:
        return ''
      case SpeedDialStates.ACTIONCHOOSED:
        return this.showIcon
      case SpeedDialStates.ALLACTIONS:
        return this.hideIcon
      default:
        return ''
    }
  }

  get buttonLabel() {
    return this.middleState == SpeedDialStates.CLOSED ? 'Choisir une action' : '';
  }

  constructor(private siegeService: SiegeService) { }

  ngOnInit(): void {

  }

  toggleVisibility() {
    if (this.middleState == SpeedDialStates.CLOSED) {
      this.visible = false;
    } else if (this.middleState == SpeedDialStates.ALLACTIONS) {
      this.visible = true;
    } else {
      this.visible = false;
    }

    this.visibleChange.emit(this.visible);
  }

  buttonClick(event: Event) {
    if (this.middleState === SpeedDialStates.CLOSED) {

      this.middleState = SpeedDialStates.ALLACTIONS;
      this.visible = true;

    } else if (this.middleState === SpeedDialStates.ALLACTIONS) {
      this.siegeService.closeSpeedDial(true);
      this.middleState = SpeedDialStates.CLOSED;
      this.visible = false;

    } else if (this.middleState === SpeedDialStates.ACTIONCHOOSED) {
      this.siegeService.closeSpeedDial(true);
      this.middleState = SpeedDialStates.ALLACTIONS;
      this.selectedAction = null;
      this.siegeService.showSelection(false);
    }

    this.visibleChange.emit(this.visible);
    this.onButtonClick.emit(event);
    event.preventDefault();
  }

  itemClick(item: SpeedDialAction, event: Event) {
    this.selectedAction = item;
    this.onItemClick.emit({ item, originalEvent: event });
    event.preventDefault();



    switch (item.code) {
      case SpeedDialActionsEnum.ADD:
        this.middleState = SpeedDialStates.ACTIONCHOOSED;
        break;
      case SpeedDialActionsEnum.DELETE:
        this.middleState = SpeedDialStates.ACTIONCHOOSED;
        break;
      case SpeedDialActionsEnum.EDIT:
        this.middleState = SpeedDialStates.ACTIONCHOOSED;
        break;
      default:
        break;
    }
  }

  getItemStyle(index: number) {
    const delay = index * this.transitionDelay;
    const radius = this.radius;

    switch (this.type) {
      case 'circle':
        const angle = (360 / this.items.length) * index;
        const rad = angle * (Math.PI / 180);
        return {
          transform: this.visible
            ? `translate(${radius * Math.cos(rad)}px, ${radius * Math.sin(rad)}px)`
            : 'translate(0, 0)',
          transitionDelay: `${delay}ms`,
          opacity: this.visible ? 1 : 0
        };
      case 'semi-circle':
        const semiAngle = (180 / (this.items.length - 1)) * index;
        const semiRad = semiAngle * (Math.PI / 180);
        return {
          transform: this.visible
            ? `translate(${radius * Math.cos(semiRad)}px, ${radius * Math.sin(semiRad)}px)`
            : 'translate(0, 0)',
          transitionDelay: `${delay}ms`,
          opacity: this.visible ? 1 : 0
        };
      case 'quarter-circle':
        const quarterAngle = (90 / (this.items.length - 1)) * index;
        const quarterRad = quarterAngle * (Math.PI / 180);
        return {
          transform: this.visible
            ? `translate(${radius * Math.cos(quarterRad)}px, ${radius * Math.sin(quarterRad)}px)`
            : 'translate(0, 0)',
          transitionDelay: `${delay}ms`,
          opacity: this.visible ? 1 : 0
        };
      case 'linear':
      default:
        switch (this.direction) {
          case 'up':
            return {
              transform: this.visible ? `translateY(-${(index + 1) * radius}px)` : 'translateY(0)',
              transitionDelay: `${delay}ms`,
              opacity: this.visible ? 1 : 0
            };
          case 'down':
            return {
              transform: this.visible ? `translateY(${(index + 1) * radius}px)` : 'translateY(0)',
              transitionDelay: `${delay}ms`,
              opacity: this.visible ? 1 : 0
            };
          case 'left':
            return {
              transform: this.visible ? `translateX(-${(index + 1) * radius}px)` : 'translateX(0)',
              transitionDelay: `${delay}ms`,
              opacity: this.visible ? 1 : 0
            };
          case 'right':
            return {
              transform: this.visible ? `translateX(${(index + 1) * radius}px)` : 'translateX(0)',
              transitionDelay: `${delay}ms`,
              opacity: this.visible ? 1 : 0
            };
        }
    }
  }

  clickAfterChoseAction(event: Event, motif?: string) {
    if (this.selectedAction.code == SpeedDialActionsEnum.ADD) {
      this.onItemClick.emit({ item: this.selectedAction, originalEvent: event });
      event.preventDefault();
    } else if (this.selectedAction.code == SpeedDialActionsEnum.DELETE) {
      this.onItemClick.emit({ item: this.selectedAction, action: "Delete", originalEvent: event });
    } else if (this.selectedAction.code == SpeedDialActionsEnum.EDIT) {
      if (motif) {
        this.onItemClick.emit({ item: this.selectedAction, action: motif, originalEvent: event });
      } 
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.visible) {
      this.toggleVisibility();
      event.preventDefault();
    }
  }
}