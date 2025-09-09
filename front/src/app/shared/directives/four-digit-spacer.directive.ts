import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFourDigitSpacer]',
  standalone: true
})
export class FourDigitSpacerDirective {

  @Output() valueChanged = new EventEmitter<any>();
  private isProcessing = false;

  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event'])
  input(event: any) {
    if (this.isProcessing) return;
    
    const input = event.target as HTMLInputElement;
    if (!input) return;

    let rawValue = input.value;
    let withoutSpace = rawValue.replace(/\s+/g, '');
    const formatted = withoutSpace.match(/.{1,4}/g)?.join(' ') ?? '';

    if (rawValue !== formatted) {
      this.isProcessing = true;

      this.control.control?.setValue(formatted, { emitEvent: false });

      input.dispatchEvent(new Event('input'));

      this.isProcessing = false;
    }

    this.valueChanged.emit(formatted);

  }
}
