//#region Imports

import { Injectable } from '@angular/core';
import { NbRoleProvider } from '@nebular/security';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../user/user.service';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class RoleService implements NbRoleProvider {

  //#region Constructor

  constructor(
    protected readonly user: UserService,
  ) { }

  //#endregion

  //#region Public Methods

  public getRole(): Observable<string[]> {
    return this.user.getCurrentUser$().pipe(
      map(currentUser => currentUser?.roles || ['none']),
    );
  }

  public getRoleSync(): string[] {
    return this.user.getCurrentUser()?.roles || ['none'];
  }

  //#endregion

}
