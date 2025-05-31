import { AfterViewInit, Directive, ElementRef, inject, Input, ViewContainerRef } from '@angular/core';
import { Tooltip } from 'primeng/tooltip';

@Directive({
  selector: '[appAutoTooltip]',
  standalone: true,
  providers: [Tooltip]
})
export class AutoTooltipDirective implements AfterViewInit {

  @Input('appAutoTooltip') tooltipText = '';
  @Input() tooltipDuration = 2000;

  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    const tooltipElement = document.querySelector('p-tooltip');
    if (!tooltipElement) return;

    const event = new MouseEvent('mouseenter', {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    // Simule un hover pour afficher le tooltip
    this.el.nativeElement.dispatchEvent(event);

    // Masquer après la durée
    setTimeout(() => {
      const leaveEvent = new MouseEvent('mouseleave', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      this.el.nativeElement.dispatchEvent(leaveEvent);
    }, this.tooltipDuration);
  }
}
