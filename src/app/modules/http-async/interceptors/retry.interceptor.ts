//#region Imports

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

//#endregion

/**
 * A classe que representa o Interceptor que lida com o "retry" de uma requisição em determinadas condições
 */
@Injectable({
  providedIn: 'root',
})
export class RetryInterceptor implements HttpInterceptor {

  //#region Private Properties

  /**
   * A quantidade de tentativas que ele deve permitir realizar antes de parar
   */
  private readonly maxRetriesAttempts: number = 3;

  /**
   * O tempo que esse interceptor irá esperar até tentar realizar a requisição novamente
   */
  private readonly retryInterval: number = 1_000;

  //#endregion

  //#region Public Methods

  /**
   * Método que realiza a ação de Interceptar e realizar mais alguma operação caso necessário
   */
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen(attempts => {
        return attempts.pipe(
          mergeMap((error: HttpErrorResponse, i) => {
            const retryAttempt = i;

            if (error.status >= 100 && error.status < 500)
              return throwError(error);

            if (retryAttempt > this.maxRetriesAttempts)
              return throwError(error);

            return timer(retryAttempt * this.retryInterval);
          }),
        );
      }),
    );
  }

  //#endregion

}
