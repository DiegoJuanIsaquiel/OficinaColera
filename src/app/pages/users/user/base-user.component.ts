//#region Imports

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  public formGroup: FormGroup<{ email: FormControl<string>; password: FormControl<string>; roles: FormControl<string[]>; isActive: FormControl<boolean> }>;

  //endregion

}
