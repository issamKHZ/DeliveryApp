import { NgStyle, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-large-content-field',
  standalone: true,
  imports: [NgStyle, NgClass, TooltipModule],
  templateUrl: './large-content-field.component.html',
  styleUrl: './large-content-field.component.scss'
})
export class LargeContentFieldComponent implements AfterViewInit, OnChanges {

  @Input() content: string;
  @Input() styleClass?: string;
  @Input() maxwidth?: string;
  @Input() width?: string;
  @Input() margin? = 0;
  @Input() color?: string;
  @Input() rowsCount = 1;
  @Input() whiteSpacePreLine?: boolean;
  @Input() tooltipPosition = 'bottom';

  @Input() breakWholeWord = true;

  // Force refresh to fix tooltip display
  @Input() set forceRefresh(value: boolean) {
    if (value && this.mask?.nativeElement?.style) {
      this.mask.nativeElement.style.display = 'block';
      this.ngAfterViewInit();
    }
  }

  @ViewChild('mask') mask: ElementRef;
  @ViewChild('ref') ref: ElementRef;

  overflow = false;

  constructor(
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    // Recalculate overflow when content changes (after a save for example)
    if (changes['content']) {
      this.cd.detectChanges();
      this.calculateOverflow();
    }
  }

  ngAfterViewInit() {
    this.calculateOverflow();
  }

  calculateOverflow() {
    this.mask.nativeElement.style.display = 'block';

    const maskOffsetWidth = this.mask.nativeElement.getBoundingClientRect().width;
    const refOffsetWidth = this.ref.nativeElement.getBoundingClientRect().width;
    const maskOffsetHeight = this.mask.nativeElement.getBoundingClientRect().height;
    const refOffsetHeight = this.ref.nativeElement.getBoundingClientRect().height;

    if (this.rowsCount === 2) {
      this.overflow = maskOffsetWidth > refOffsetWidth + 28
        || maskOffsetHeight > refOffsetHeight;
    } else {
      this.overflow = maskOffsetWidth > refOffsetWidth;
    }
    this.mask.nativeElement.style.display = 'none';

    // Overflow calculation is incomplete.....
    // Should be good enough for now but see if other cases
    if (this.whiteSpacePreLine &&
      this.ref.nativeElement.clientHeight != null &&
      this.ref.nativeElement.scrollHeight != null &&
      this.ref.nativeElement.clientHeight < this.ref.nativeElement.scrollHeight) {
      this.overflow = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.forceRefresh = true;
  }

  computedStyle() {
    const style: any = {};
    if (this.maxwidth) {
      style['max-width'] = this.maxwidth;
    }
    if (this.width) {
      style.width = this.width;
    }
    if (this.margin != null) {
      style.margin = this.margin;
    }
    if (this.color) {
      style.color = this.color;
    }
    if (this.breakWholeWord) {
      style['overflow-wrap'] = 'anywhere';
    }

    return style;
  }

  contentClass() {
    return this.rowsCount === 2 ? 'content-2rows' : 'content-1row';
  }

  maskClass() {
    return this.rowsCount === 2 ? '' : 'mask';
  }

}
