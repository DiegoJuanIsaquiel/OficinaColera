//#region Imports

import { Component } from '@angular/core';

//#endregion

/**
 * A classe que representa as informações de autenticação
 */
@Component({
  selector: 'ngx-auth',
  template: `
    <nb-layout windowMode>
      <nb-layout-column>
        <router-outlet></router-outlet>
      </nb-layout-column>
    </nb-layout>
  `,
  styles: [`
    nb-layout::ng-deep nb-layout-column {
      padding: 0 !important;
    }
  `],
})
export class AuthComponent {}
