import { FormGroup, ValidationErrors } from '@angular/forms';

export namespace CustomValidators {
  export function mustMatch(controlName: string, matchingControlName: string): (formGroup: FormGroup) => ValidationErrors | null {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return null;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value)
        matchingControl.setErrors({ mustMatch: true });
      else
        matchingControl.setErrors(null);

      return null;
    };
  }
}
