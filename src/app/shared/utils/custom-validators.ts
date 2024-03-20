import { ValidatorFn } from '@angular/forms';

export namespace CustomValidators {
  export function mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup) => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!matchingControl || !control)
        return null;

      if (matchingControl?.errors && !matchingControl.errors.mustMatch)
        return null;

      if (control.value !== matchingControl.value)
        matchingControl.setErrors({ mustMatch: true });
      else
        matchingControl.setErrors(null);

      return null;
    };
  }
}
