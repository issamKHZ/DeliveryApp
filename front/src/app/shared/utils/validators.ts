import { AbstractControl, ValidationErrors } from "@angular/forms";

export function customEmailValidator(control: AbstractControl): ValidationErrors | null {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

  if (!control.value) {
    return null;
  }

  return emailRegex.test(control.value) ? null : { customEmail: true };
}

export function minLengthPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';

  if (value.length < 8) {
    return { tooShort: true };
  }

  return null;
}

export function complexityPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';

  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);

  if (!hasUpperCase || !hasNumber) {
    return { weakPassword: true };
  }

  return null;
}

export function ribValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value || '';

  const isRib = /^[A-Z]{2}[0-9 ]*$/.test(value);

  if (!isRib) {
    return { isNotRIB: true };
  }

  return null;

}

export function horaireValidator(control: AbstractControl): ValidationErrors | null {
  const start = control.get('start')?.value;
  const end = control.get('end')?.value;
  const indispo = control.get('indispo')?.value;

  if (indispo) {
    return null;
  }

  if (!start || !end) {
    return null;
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate.getTime() >= endDate.getTime()) {
    return { incoherent: true };
  }

  return null;
}
