//#region Imports

import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';
import { getCrudErrors } from '../../../shared/utils/functions';
import { BaseUserComponent } from './base-user.component';

//#endregion

@Component({
  selector: 'ngx-create-users',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class CreateUserComponent extends BaseUserComponent {

  //#region Construtor

  /**
   * Construtor padrão
   */
  constructor(
    protected readonly router: Router,
    protected readonly toast: NbToastrService,
    formBuilder: FormBuilder,
    route: ActivatedRoute,
    http: HttpAsyncService,
  ) {
    super(formBuilder, route, http);
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que é chamado ao tentar cadastrar uma postagem
   */
  public async onSubmit(): Promise<void> {
    this.showLoading = true;

    const payload = this.formGroup.getRawValue();
    const { error } = await this.http.post(`/users`, payload);

    this.showLoading = false;

    if (error)
      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    this.toast.success('Usuário criado com sucesso!', 'Sucesso');

    await this.router.navigateByUrl(this.backUrl);
  }

  //#endregion

}
