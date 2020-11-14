//#region Imports

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { environment } from '../../../environments/environment';

//#endregion

/**
 * A classe que representa o guard que lida com a autenticação do APP
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticateGuard implements CanActivate {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly router: Router,
  ) { }

  //#endregion

  /**
   * Método que diz se deve ativar a rota ou não
   */
  public async canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot) {
    const shouldLogout = route.queryParamMap.get('shouldLogout');
    const { unprotectedRoute, protectedRoute, routeToRedirect } = route.data || { };

    if (shouldLogout)
      localStorage.clear();

    if (!routeToRedirect)
      return true;

    const hasToken = !!localStorage.getItem(environment.keys.token);

    if (hasToken && protectedRoute)
      return true;

    if (!hasToken && unprotectedRoute)
      return true;

    return void await this.router.navigate([routeToRedirect], { replaceUrl: true });
  }
}
