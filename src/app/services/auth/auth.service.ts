//#region Imports

import { Injectable } from '@angular/core';
import { NbAclService } from '@nebular/security';
import { RoleService } from '../role/role.service';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //#region Constructor

  constructor(
    protected readonly role: RoleService,
    protected readonly nbAcl: NbAclService,
  ) { }

  //#endregion

  //#region Public Methods

  public hasRole(role: string): boolean {
    const roles = this.role.getRoleSync();

    return roles.includes(role);
  }

  public isGranted(action: string, resource: string): boolean {
    const roles = this.role.getRoleSync();

    return roles.some(role => this.nbAcl.can(role, action, resource));
  }

  //#endregion

}
