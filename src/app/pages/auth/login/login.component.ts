//#region Imports

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

import { environment } from '../../../../environments/environment';
import { TokenProxy } from '../../../models/proxys/token.proxy';
import { UserProxy } from '../../../models/proxys/user.proxy';
import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';
import { getCrudErrors, isAdmin } from '../../../shared/utils/functions';

//#endregion

/**
 * A classe que representa a página de autenticação
 */
@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly http: HttpAsyncService,
    private readonly toast: NbToastrService,
    private readonly fb: FormBuilder,
  ) {
    this.formGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    if (this.route.snapshot.queryParamMap.has('shouldLogout'))
      this.router.navigateByUrl(environment.config.redirectToWhenUnauthenticated, { replaceUrl: true });
  }

  //#endregion

  //#region Public Properties

  /**
   * A referencia do formulário
   */
  public formGroup: FormGroup;

  /**
   * Diz se deve esconder a senha
   */
  public hidePassword = true;

  /**
   * Diz se está realizando o login
   */
  public isLoadingLogin: boolean;

  //#endregion

  //#region Public Methods

  /**
   * Método que realiza o login de um usuário
   */
  public async onSubmit(): Promise<void> {
    if (this.formGroup.invalid || this.isLoadingLogin)
      return;

    this.isLoadingLogin = true;
    const { error, success } = await this.http.post<TokenProxy>(environment.api.auth.login, this.formGroup.getRawValue());

    if (error) {
      this.isLoadingLogin = false;

      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');
    }

    if (!isAdmin(success.token)) {
      this.isLoadingLogin = false;

      return void this.toast.danger('Você não tem permissão para acessar esses recursos.', 'Oops...');
    }

    localStorage.setItem(environment.keys.token, success.token);
    localStorage.setItem(environment.keys.refreshToken, success.refreshToken);

    const { error: userError, success: user } = await this.http.get<UserProxy>(environment.api.users.me);

    this.isLoadingLogin = false;

    if (userError)
      return void this.toast.danger(getCrudErrors(userError)[0], 'Oops...');

    localStorage.setItem(environment.keys.user, JSON.stringify(user));

    await this.router.navigateByUrl(environment.config.redirectToWhenAuthenticated);
  }

  //#endregion

}
