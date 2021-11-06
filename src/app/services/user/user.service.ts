//#region Imports

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserProxy } from '../../models/proxys/user.proxy';

//#endregion

/**
 * A classe que representa o serviço que lida com as informações do usuário
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor() {
    this.currentUser$ = new BehaviorSubject<UserProxy | null>(this.getCurrentUser());
  }

  //#endregion

  //#region Public Properties

  /**
   * As informações do usuário atual
   */
  private readonly currentUser$: BehaviorSubject<UserProxy | null>;

  //#endregion

  //#region Public Methods

  /**
   * Método que retorna as informações de um usuário
   */
  public getCurrentUser$(): Observable<UserProxy | null> {
    return this.currentUser$.asObservable();
  }

  /**
   * Método que retorna as informações de um usuário
   */
  public getCurrentUser(): UserProxy | null {
    try {
      return JSON.parse(localStorage.getItem(environment.keys.user));
    } catch (e) {
      return null;
    }
  }

  /**
   * Método que atualiza as informações internas do usuário atual
   */
  public refreshCurrentUser(): void {
    this.currentUser$.next(this.getCurrentUser());
  }

  //#endregion

}
