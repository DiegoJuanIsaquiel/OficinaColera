//#region Imports

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

import { UserProxy } from '../../../models/proxys/user.proxy';
import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';
import { getCrudErrors, hasRole } from '../../../shared/utils/functions';
import { BaseUserComponent } from './base-user.component';

//#endregion

@Component({
  selector: 'ngx-update-sector',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
/**
 * A classe que representa a página para atualizar as informações de uma entidade
 */
export class UpdateUserComponent extends BaseUserComponent implements OnInit {

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

  //#region LifeCycle Events

  /**
   * Método que é executado ao iniciar o componente
   */
  public async ngOnInit(): Promise<void | boolean> {
    if (!this.isUpdate)
      return await this.router.navigateByUrl(this.backUrl);

    this.showLoading = true;

    const entityId = this.route.snapshot.paramMap.get('entityId');
    const { error, success: entity } = await this.http.get<UserProxy>(`/users/${ entityId }`);

    this.showLoading = false;

    if (error)
      return await this.router.navigateByUrl(this.backUrl);

    this.formGroup.controls.email.setValue(entity.email);

    const hasUser = hasRole(entity.permissions, 'user');
    const hasUserAdmin = hasRole(entity.permissions, 'admin');

    this.formGroup.controls.roles.setValue(hasUserAdmin ? 'admin' : hasUser ? 'user' : 'none');
    this.formGroup.controls.isActive.setValue(entity.isActive);
  }

  //#endregion

  //#region Public Methods

  /**
   * Método chamado ao atualizar uma entidade
   */
  public async onSubmit(): Promise<void> {
    this.showLoading = true;

    const payload = this.formGroup.getRawValue();
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const { error } = await this.http.put<UserProxy>(`/users/${ entityId }`, payload);

    this.showLoading = false;

    if (error)
      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    this.toast.success('Usuário atualizado com sucesso!', 'Sucesso');

    await this.router.navigateByUrl(this.backUrl);
  }

  //#endregion

}
