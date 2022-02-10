//#region Imports

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { environment } from '../../../environments/environment';
import { UserService } from '../../services/user/user.service';

//#endregion

@Injectable({
  providedIn: 'root',
})
export class AuthenticateGuard implements CanActivate {

  //#region Constructor

  constructor(
    protected readonly router: Router,
    protected readonly user: UserService,
  ) { }

  //#endregion

  public async canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<boolean> {
    const shouldLogout = route.queryParamMap.get('shouldLogout');
    const { unprotectedRoute, protectedRoute, routeToRedirect } = route.data || {};

    if (shouldLogout) {
      localStorage.clear();
      this.user.refreshCurrentUser();
    }

    if (!routeToRedirect)
      return true;

    const hasToken = !!localStorage.getItem(environment.keys.token);

    if (hasToken && protectedRoute)
      return true;

    if (!hasToken && unprotectedRoute)
      return true;

    return await this.router.navigate([routeToRedirect], { replaceUrl: true }).then(() => false);
  }
}
