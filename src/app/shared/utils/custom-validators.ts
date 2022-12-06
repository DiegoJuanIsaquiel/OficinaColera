import { UntypedFormGroup, ValidationErrors } from '@angular/forms';

export namespace CustomValidators {
  export function mustMatch(controlName: string, matchingControlName: string): (formGroup: UntypedFormGroup) => ValidationErrors | null {
    return (formGroup: UntypedFormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch)
        return null;

      if (control.value !== matchingControl.value)
        matchingControl.setErrors({ mustMatch: true });
      else
        matchingControl.setErrors(null);

      return null;
    };
  }
}
