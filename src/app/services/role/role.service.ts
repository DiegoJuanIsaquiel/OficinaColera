//#region Imports

import { Injectable } from '@angular/core';
import { NbRoleProvider } from '@nebular/security';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../user/user.service';

//#endregion

/**
 * A classe que representa o serviço que lida com as permissões
 */
@Injectable({
  providedIn: 'root',
})
export class RoleService implements NbRoleProvider {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    protected readonly user: UserService,
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna um observable com as permissões do usuário
   */
  public getRole(): Observable<string> {
    return this.user.getCurrentUser$().pipe(
      map(currentUser => currentUser?.permissions || 'none'),
    );
  }

  /**
   * Método que retorna um observable com as permissões do usuário
   */
  public getRoleSync(): string {
    return this.user.getCurrentUser()?.permissions || 'none';
  }

  //#endregion

}
