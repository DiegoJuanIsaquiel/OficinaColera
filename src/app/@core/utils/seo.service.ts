//#region Imports

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NB_DOCUMENT } from '@nebular/theme';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

//#endregion

/**
 * A classe que lida com o SEO da aplicação
 */
@Injectable()
export class SeoService implements OnDestroy {

  constructor(
    private router: Router,
    @Inject(NB_DOCUMENT) document,
    @Inject(PLATFORM_ID) platformId,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.dom = document;

    if (this.isBrowser) {
      this.createCanonicalTag();
    }
  }

  //#region Private Properties

  /**
   * A referência para as inscrições desse serviço
   */
  private readonly destroy$ = new Subject<void>();

  /**
   * A referência do DOM
   */
  private readonly dom: Document;

  /**
   * Diz se está sendo executado em um navegador
   */
  private readonly isBrowser: boolean;

  /**
   * O Link criado para manter o SEO
   */
  private linkCanonical: HTMLLinkElement;

  //#endregion

  //#region LifeCycle Events

  /**
   * Método executado ao destruir o componente
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //#endregion

  //#region Public Methods

  /**
   * Método que cria as tags canonicas
   */
  public createCanonicalTag(): void {
    this.linkCanonical = this.dom.createElement('link');
    this.linkCanonical.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(this.linkCanonical);
    this.linkCanonical.setAttribute('href', this.getCanonicalUrl());
  }

  /**
   * Método que cuida de atualizar o Link no cabeçalho com o URL Canónico
   */
  public trackCanonicalChanges(): void {
    if (!this.isBrowser)
      return;

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(this.destroy$),
    )
      .subscribe(() => {
        this.linkCanonical.setAttribute('href', this.getCanonicalUrl());
      });
  }

  //#endregion

  //#region Private Methods

  /**
   * Método que retorna um URL Canónico
   */
  private getCanonicalUrl(): string {
    return this.dom.location.origin + this.dom.location.pathname;
  }

  //#endregion

}
