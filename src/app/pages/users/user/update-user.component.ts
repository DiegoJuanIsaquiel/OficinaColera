//#region Imports

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { environment } from '../../../../environments/environment';
import { UserProxy } from '../../../models/proxys/user.proxy';
import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';
import { getCrudErrors } from '../../../shared/utils/functions';
import { apiRoutes } from '../../../../environments/api-routes';
import { BaseUserComponent } from './base-user.component';

//#endregion

@Component({
  selector: 'ngx-update-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UpdateUserComponent extends BaseUserComponent implements OnInit {

  //#region Constructor

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

  public async ngOnInit(): Promise<void | boolean> {
    if (!this.isUpdate)
      return await this.router.navigateByUrl(this.backUrl);

    this.showLoading = true;

    const entityId = this.route.snapshot.paramMap.get('entityId');
    const url = apiRoutes.users.get.replace('{userId}', entityId ?? '0');
    const { error, success: entity } = await this.http.get<UserProxy>(url);

    this.showLoading = false;

    if (error || !entity)
      return await this.router.navigateByUrl(this.backUrl);

    this.formGroup.controls.email.setValue(entity.email);
    this.formGroup.controls.roles.setValue(entity.roles);
    this.formGroup.controls.isActive.setValue(entity.isActive);
  }

  //#endregion

  //#region Public Methods

  public async onSubmit(): Promise<void> {
    this.showLoading = true;

    const payload = this.formGroup.getRawValue();
    const entityId = this.route.snapshot.paramMap.get('entityId');
    const url = apiRoutes.users.update.replace('{userId}', entityId ?? '0');
    const { error } = await this.http.put<UserProxy>(url, payload);

    this.showLoading = false;

    if (error)
      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    this.toast.success('Usuário atualizado com sucesso!', 'Sucesso');

    await this.router.navigateByUrl(this.backUrl);
  }

  //#endregion

}
