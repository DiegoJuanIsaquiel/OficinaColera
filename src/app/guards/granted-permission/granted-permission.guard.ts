//#region Imports

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

//#endregion

/**
 * Classe utilizada para verificar se o usuário possui a
 * permissão necessária para acessar a página.
 */
@Injectable({
  providedIn: 'root',
})
export class GrantedPermissionGuard implements CanActivate {

  //#region Constructor

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
  }

  //#endregion

  //#region Public Methods

  public async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const { keyToCheck, routeToRedirectWhenHasNoPermission } = route.data;

    if (this.authService.isGranted('view', keyToCheck))
      return true;

    return await this.router.navigate([routeToRedirectWhenHasNoPermission], { replaceUrl: true });
  }

  //#endregion
}
