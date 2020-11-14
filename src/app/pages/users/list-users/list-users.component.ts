//#region Imports

import { Component } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

import { UserProxy } from '../../../models/proxys/user.proxy';
import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';
import { PaginationHttpShared } from '../../../shared/pagination/pagination.http.shared';

//#endregion

/**
 * A classe que representa a página que lista os usuários existentes
 */
@Component({
  selector: 'ngx-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent extends PaginationHttpShared<UserProxy> {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    toast: NbToastrService,
    http: HttpAsyncService,
  ) {
    super(toast, http,
      '/users',
      ['email', 'createdAt', 'updatedAt', 'actions'],
      ['email', 'createdAt', 'updatedAt', 'roles', 'isActive'],
      async search => (
        [
          {
            email: { $contL: '' },
          },
          {
            $or: [
              { email: { $contL: search } },
            ],
          },
        ]),
    );
  }

  //#endregion

}
