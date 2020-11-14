//#region Imports

import { BaseCrudProxy } from './base/base-crud.proxy';

//#endregion

/**
 * A classe que representa a entidade que lida com os usuários
 */
export interface UserProxy extends BaseCrudProxy {

  /**
   * O e-mail desse usuário
   */
  email: string;

  /**
   * As permissões desse usuário
   */
  permissions: string;

}
