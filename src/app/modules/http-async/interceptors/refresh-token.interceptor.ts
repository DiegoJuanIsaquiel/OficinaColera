//#region Imports

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import decode from 'jwt-decode';
import { Observable, from, of } from 'rxjs';
import { catchError, concatAll, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { TokenProxy } from '../../../models/proxys/token.proxy';
import { UserService } from '../../../services/user/user.service';

//#endregion

//#region Class

/**
 * Serviço que intercepta todas as requisições e verifica se ainda tem permissão para usar o app
 */
@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly router: Router,
    private readonly toast: NbToastrService,
    private readonly user: UserService,
  ) {
  }

  //#endregion

  //#region Methods

  /**
   * Método que intercepta a requisição
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.user.getCurrentUser();

    if (!user)
      return next.handle(req);

    const canPerformRequest$ = of(localStorage.getItem(environment.keys.token)).pipe(
      map(token => {
        const refreshToken = localStorage.getItem(environment.keys.refreshToken);

        if (!token || !refreshToken)
          return of(true);

        type JWTDecoded = { exp: number };

        const jwtPayload: JWTDecoded = decode(token);
        const refreshJwtPayload: JWTDecoded = decode(refreshToken);

        const fiveMinutesInMilliseconds = 1_000 * 5;
        const maxSafeExpiresDate = +new Date() + fiveMinutesInMilliseconds;

        const expiresIn = +new Date(jwtPayload.exp * 1000);
        const shouldRefreshToken = maxSafeExpiresDate >= expiresIn;

        if (!shouldRefreshToken)
          return of(true);

        const refreshExpiresIn = +new Date(refreshJwtPayload.exp * 1000);
        const maxSafeRefreshExpiresDate = +new Date() + fiveMinutesInMilliseconds;

        const canRefreshToken = maxSafeRefreshExpiresDate >= refreshExpiresIn;

        if (!canRefreshToken)
          return of(false);

        return from(this.tryRefreshToken(refreshToken));
      }),
      concatAll(),
    );

    return canPerformRequest$.pipe(
      map(canPerform => {
        if (canPerform)
          return next.handle(req);

        throw new HttpErrorResponse({ error: { message: 'A sua sessão expirou, você precisa logar novamente.' }, status: 401 });
      }),
      concatAll(),
      catchError(error => {
        if (error.status !== 401)
          throw error;

        localStorage.clear();

        this.router.navigateByUrl(environment.config.redirectToWhenUnauthenticated, { replaceUrl: true })
          .then(() => this.toast.info('A sua sessão expirou, por favor, entre novamente para continuar acessando o painel.', 'Alerta!'));

        throw error;
      }),
    );
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que realiza a renovação do token de autenticação atual utilizando o token de atualização
   *
   * @param refreshToken O token de renovação
   */
  private async tryRefreshToken(refreshToken: string): Promise<boolean> {
    return await fetch(`${ environment.api.baseUrl }/auth/refresh`, {
      method: 'POST',
      headers: {
        ['Authorization']: refreshToken,
        ['Content-Type']: 'application/json',
        ['Accept']: 'application/json',
      },
    } as unknown as Request)
      .then(async result => result.ok
        ? ({ success: await result.json() as unknown as TokenProxy, error: undefined })
        : ({
          success: undefined, error: new HttpErrorResponse({ error: 'A sua sessão expirou, você precisa logar novamente.', status: 401 }),
        }))
      .catch(error => ({ error, success: undefined }))
      .then(async result => {
        if (result.error || !result.success)
          return false;

        localStorage.setItem(environment.keys.token, result.success.token);
        localStorage.setItem(environment.keys.refreshToken, result.success.refreshToken);

        return true;
      });
  }

  //#endregion

}

//#endregion
