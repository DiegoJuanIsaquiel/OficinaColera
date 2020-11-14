//#region Imports

import { Component, OnInit } from '@angular/core';

import { SeoService } from './@core/utils/seo.service';

//#endregion

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private seoService: SeoService,
  ) { }

  //#endregion

  //#region LifeCycle Events

  /**
  * Método executado ao iniciar o componente
  */
  public async ngOnInit(): Promise<void> {
    this.seoService.trackCanonicalChanges();
  }

  //#endregion

}
