import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneNumber]',
  standalone: true
})
export class PhoneNumberDirective {
  private readonly prefix = '(+212) ';
  private readonly maxDigits = 10;

  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    // Récupère uniquement les chiffres
    let digits = input.value.replace(/\D/g, '');

    let finalValue: string;

    if (digits.length === 0) {
      // Champ vide → pas de formatage
      finalValue = '';
    } else if (digits.startsWith('212')) {
      // Si l'utilisateur tape l'indicatif complet
      digits = digits.slice(3);
      digits = digits.slice(0, this.maxDigits);
      const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
      finalValue = this.prefix + formatted;
    } else if (digits.length > 0 && !input.value.startsWith(this.prefix)) {
      // Ajout automatique du préfixe si on tape un numéro marocain sans l'écrire
      digits = digits.slice(0, this.maxDigits);
      const formatted = digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
      finalValue = this.prefix + formatted;
    } else {
      // Sinon, juste formater
      digits = digits.slice(0, this.maxDigits);
      finalValue = digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    }

    // Mise à jour
    input.value = finalValue;
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(finalValue, { emitEvent: false });
    }
  }
}
