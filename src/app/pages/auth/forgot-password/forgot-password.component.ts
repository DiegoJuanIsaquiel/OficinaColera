//#region Imports

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { apiRoutes } from '../../../../environments/api-routes';
import { ForgotPasswordStepsEnum } from '../../../models/enums/forgot-password-steps.enum';
import { ForgotPasswordForm } from '../../../models/forms/forgot-password.form';
import { ResetPasswordPayload } from '../../../models/payloads/reset-password.payload';
import { UserProxy } from '../../../models/proxys/user.proxy';
import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';
import { CustomValidators } from '../../../shared/utils/custom-validators';
import { Formfy } from '../../../shared/utils/formfy';
import { getCrudErrors } from '../../../shared/utils/functions';

//#endregion

@Component({
  selector: 'ngx-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {

  //#region Constructor

  constructor(
    protected readonly formBuilder: FormBuilder,
    protected readonly router: Router,
    protected readonly http: HttpAsyncService,
    protected readonly toast: NbToastrService,
  ) {
    this.formGroup = this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      code: [''],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: CustomValidators.mustMatch('newPassword', 'confirmPassword'),
    });
  }

  //#endregion

  //#region Properties

  public isLoading: boolean = false;

  public formGroup: Formfy<ForgotPasswordForm>;

  public currentStep: ForgotPasswordStepsEnum = ForgotPasswordStepsEnum.EMAIL;

  public stepsEnum: typeof ForgotPasswordStepsEnum = ForgotPasswordStepsEnum;

  //#endregion

  //#region Methods

  public async sendCodeToEmail(): Promise<void> {
    if (this.isLoading)
      return;

    this.isLoading = true;

    const email = this.formGroup.getRawValue().email;
    const url = apiRoutes.userPassword.forgotPassword.replace('{email}', email);

    const { error } = await this.http.post<UserProxy>(url, {});

    this.isLoading = false;

    if (error)
      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    this.toast.success('Código de recuperação enviado para o email!', 'Sucesso');

    this.currentStep = ForgotPasswordStepsEnum.NEW_PASSWORD;
  }

  public async resetPassword(): Promise<void> {
    if (this.isLoading)
      return;

    this.isLoading = true;

    const {
      code,
      newPassword,
    } = this.formGroup.getRawValue();

    const payload: ResetPasswordPayload = {
      newPassword,
    };

    const url = apiRoutes.userPassword.resetPassword.replace('{resetPasswordCode}', code);

    const { error } = await this.http.post<UserProxy>(url, payload);

    this.isLoading = false;

    if (error)
      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    this.toast.success('Senha alterada!', 'Sucesso');
    await this.router.navigateByUrl('/auth/login');
  }

  //#endregion

}
