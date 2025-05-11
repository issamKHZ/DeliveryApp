import { Directive, ElementRef, EventEmitter, Host, HostListener, Input, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';

@Directive({
  selector: '[appDigitSpacerLimited]',
  standalone: true
})
export class DigitSpacerLimitedDirective {
  @Output() valueChanged = new EventEmitter<any>();
  private isProcessing = false;

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  input(event: any) {
    if (this.isProcessing) return;

    const input = event.target as HTMLInputElement;
    if (!input) return;

    let rawValue = input.value;
    let digitsOnly = rawValue.replace(/\D/g, '').slice(0, 10); // max 10 digits

    // Ajoute les espaces tous les 2 caractères
    const formatted = digitsOnly.match(/.{1,2}/g)?.join(' ') ?? '';

    if (rawValue !== formatted) {
      this.isProcessing = true; 

      this.control.control?.setValue(formatted, { emitEvent: false });
      
      input.dispatchEvent(new Event('input'));

      this.isProcessing = false;
    }

    this.valueChanged.emit(formatted);
  }

}
