import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minFilesValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.length < min) {
      return {
        minFiles: {
          required: min,
          actual: control.value.length,
          message: `Vous devez uploader au moins ${min} fichiers.`
        }
      };
    }
    return null;
  };
}