//#region Imports

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';

//#endregion

/**
 * A classe base para a criação de uma entidade
 */
export class BaseUserComponent {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected route: ActivatedRoute,
    protected http: HttpAsyncService,
  ) {
    this.backUrl = '/pages/users';
    this.isUpdate = route.snapshot.paramMap.has('entityId');

    this.formGroup = formBuilder.group({
      email: ['', Validators.required],
      password: this.isUpdate ? [''] : ['', Validators.required],
      roles: ['', Validators.required],
      isActive: [true],
    });
  }

  //#endregion

  //#region Default Public Properties

  /**
   * Diz se está atualizando
   */
  public isUpdate: boolean;

  /**
   * Diz se deve exibir um loading
   */
  public showLoading: boolean;

  /**
   * O url no qual ele será redirecionado
   */
  public backUrl: string;

  /**
   * As informações do form
   */
  public formGroup: FormGroup;

  //endregion

}
