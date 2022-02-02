//#region Imports

import { Component } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

import { UserProxy } from '../../../models/proxys/user.proxy';
import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';
import { UserService } from '../../../services/user/user.service';
import { PaginationHttpShared } from '../../../shared/pagination/pagination.http.shared';

//#endregion

@Component({
  selector: 'ngx-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent extends PaginationHttpShared<UserProxy> {

  //#region Constructor

  constructor(
    toast: NbToastrService,
    http: HttpAsyncService,
    user: UserService,
  ) {
    super(toast, http, user,
      '/user',
      ['name', 'email', 'createdAt', 'updatedAt', 'actions'],
      ['name', 'email', 'createdAt', 'updatedAt', 'roles', 'isActive'],
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
