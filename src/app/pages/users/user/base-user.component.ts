//#region Imports

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';

//#endregion

export class BaseUserComponent {

  //#region Constructor

  constructor(
    protected readonly formBuilder: FormBuilder,
    protected readonly route: ActivatedRoute,
    protected readonly http: HttpAsyncService,
  ) {
    this.backUrl = this.route.snapshot.queryParamMap.get('backUrl') || '/pages/user';
    this.isUpdate = route.snapshot.paramMap.has('entityId');

    this.formGroup = formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: this.isUpdate ? [''] : ['', Validators.required],
      roles: ['', Validators.required],
      isActive: [true],
    });
  }

  //#endregion

  //#region Default Public Properties

  public isUpdate: boolean;

  public showLoading: boolean;

  public backUrl: string;

  public formGroup: FormGroup;

  //endregion

}
