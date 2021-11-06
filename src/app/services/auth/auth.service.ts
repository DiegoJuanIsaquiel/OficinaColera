//#region Imports

import { Injectable } from '@angular/core';
import { NbAclService } from '@nebular/security';
import { RoleService } from '../role/role.service';

//#endregion

/**
 * A classe que representa o serviço que lida com a autenticação
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    protected readonly role: RoleService,
    protected readonly nbAcl: NbAclService,
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que verifica se um usuário possui alguma role em específico
   *
   * @param role A role que desejam verificar
   */
  public hasRole(role: string): boolean {
    const roles = this.role.getRoleSync();

    return roles.includes(role);
  }

  /**
   * Método que valida se o usuário pode realizar alguma ação
   */
  public isGranted(action: string, resource: string): boolean {
    const roles = this.role.getRoleSync();

    return roles.some(role => this.nbAcl.can(role, action, resource));
  }

  //#endregion

}
