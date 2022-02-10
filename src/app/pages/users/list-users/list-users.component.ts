//#region Imports

import { Component } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { environment } from '../../../../environments/environment';
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
      environment.api.users.list,
      ['email', 'createdAt', 'updatedAt', 'actions'],
      ['email', 'createdAt', 'updatedAt', 'roles', 'isActive'],
      async search => (
        [
          {},
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
