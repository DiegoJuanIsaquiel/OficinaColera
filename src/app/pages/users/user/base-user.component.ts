//#region Imports

import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseUserForm } from '../../../models/forms/base-user.form';
import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';
import { Formfy } from '../../../shared/utils/formfy';

//#endregion

export class BaseUserComponent {

  //#region Constructor

  constructor(
    protected readonly formBuilder: FormBuilder,
    protected readonly route: ActivatedRoute,
    protected readonly http: HttpAsyncService,
  ) {
    this.backUrl = this.route.snapshot.queryParamMap.get('backUrl') || '/pages/users';
    this.isUpdate = route.snapshot.paramMap.has('entityId');

    this.formGroup = formBuilder.nonNullable.group({
      email: ['', Validators.required],
      password: this.isUpdate ? [''] : ['', Validators.required],
      roles: [[] as string[], Validators.required],
      isActive: [true],
    });
  }

  //#endregion

  //#region Default Public Properties

  public isUpdate: boolean = false;
  public showLoading: boolean = false;

  public backUrl: string;

  public formGroup: Formfy<BaseUserForm, 'roles'>;

  //endregion

}
