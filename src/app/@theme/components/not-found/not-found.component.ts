//#region Imports

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';

//#endregion

/**
 * A classe que representa a página padrão para quando o usuário vai para uma rota que não existe
 */
@Component({
  selector: 'ngx-not-found',
  styleUrls: ['./not-found.component.scss'],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly router: Router,
  ) { }

  //#endregion

  //#region Public Methods

  /**
   * Método que redireciona o usuário a página inicial
   */
  public goToHome(): void {
    this.router.navigateByUrl(environment.config.redirectToWhenAuthenticated);
  }

  //#endregion

}
