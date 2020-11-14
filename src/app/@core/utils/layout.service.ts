//#region Imports

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, delay, shareReplay } from 'rxjs/operators';

//#endregion

/**
 * A classe que representa o serviço que lida com o layout da aplicação
 */
@Injectable()
export class LayoutService {

  //#region Protected Properties

  /**
   * O evento que fica escutando se houve uma mudança no layout
   */
  protected layoutSize$ = new Subject();

  /**
   * O evento que é lançado quando há uma mudança do tamanho do layout
   */
  protected layoutSizeChange$ = this.layoutSize$.pipe(
    shareReplay({ refCount: true }),
  );

  //#endregion

  //#region Public Methods

  /**
   * Método que notifica que houve uma mudança no layout
   */
  public changeLayoutSize(): void {
    this.layoutSize$.next();
  }

  /**
   * Método que retorna o Observable com o evento de mudança de layout
   */
  public onChangeLayoutSize(): Observable<any> {
    return this.layoutSizeChange$.pipe(delay(1));
  }

  /**
   * Método que retorna o Observable com o evento de mudança de layout
   * e notifica apenas quando for seguro para realizar alguma alteração
   */
  public onSafeChangeLayoutSize(): Observable<any> {
    return this.layoutSizeChange$.pipe(
      debounceTime(350),
    );
  }

  //#endregion

}
