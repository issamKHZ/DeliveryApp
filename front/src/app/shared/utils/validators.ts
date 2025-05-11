import { AbstractControl, ValidationErrors } from "@angular/forms";

export function customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
  
    if (!control.value) {
      return null;
    }
  
    return emailRegex.test(control.value) ? null : { customEmail: true };
}