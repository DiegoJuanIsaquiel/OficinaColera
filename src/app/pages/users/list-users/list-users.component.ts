//#region Imports

import { Component } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { environment } from '../../../../environments/environment';
import { UserProxy } from '../../../models/proxys/user.proxy';
import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';
import { UserService } from '../../../services/user/user.service';
import { PaginationHttpShared } from '../../../shared/pagination/pagination.http.shared';
import { RolePipe } from '../../../pipes/role.pipe';

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
      ['email', 'roles', 'createdAt', 'updatedAt', 'isActive', 'actions'],
      ['email', 'roles', 'createdAt', 'updatedAt', 'roles', 'isActive'],
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

  //#region Protected Methods

  /**
   * @inheritDoc
   */
  protected getFormattedDataToExcel(items: UserProxy[]): any {
    return items.map((item) => ({
      ['ID']: item.id,
      ['E-mail']: item.email,
      ['Permissões']: new RolePipe().transform(item.roles),
      ['Criado Em']: item.createdAt,
      ['Atualizado Em']: item.updatedAt,
      ['Está Ativo?']: item.isActive ? 'Ativo' : 'Desativado',
    }));
  }

  //#endregion

}
