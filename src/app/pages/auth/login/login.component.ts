//#region Imports

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { environment } from '../../../../environments/environment';
import { TokenProxy } from '../../../models/proxys/token.proxy';
import { UserProxy } from '../../../models/proxys/user.proxy';
import { HttpAsyncService } from '../../../modules/http-async/services/http-async.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { getCrudErrors } from '../../../shared/utils/functions';

//#endregion

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  //#region Constructor

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly http: HttpAsyncService,
    private readonly toast: NbToastrService,
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly user: UserService,
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

  public formGroup: FormGroup;

  public shouldHidePassword = true;

  public isLoadingLogin: boolean = false;

  //#endregion

  //#region Public Methods

  public async onSubmit(): Promise<void> {
    if (this.formGroup.invalid || this.isLoadingLogin)
      return;

    this.isLoadingLogin = true;

    const { error, success } = await this.http.post<TokenProxy>(environment.api.auth.login, this.formGroup.getRawValue());

    this.isLoadingLogin = false;

    if (error || !success)
      return void this.toast.danger(getCrudErrors(error)[0], 'Oops...');

    localStorage.setItem(environment.keys.token, success.token);
    localStorage.setItem(environment.keys.refreshToken, success.refreshToken);

    await this.refreshUser();
    await this.navigateToHomeIfUserHasPermission();
  }

  //#endregion

  //#region Private Methods

  private async refreshUser(): Promise<void> {
    this.isLoadingLogin = true;

    const { error: userError, success: user } = await this.http.get<UserProxy>(environment.api.users.me);

    this.isLoadingLogin = false;

    if (userError)
      return void this.toast.danger(getCrudErrors(userError)[0], 'Oops...');

    localStorage.setItem(environment.keys.user, JSON.stringify(user));
    this.user.refreshCurrentUser();
  }

  private async navigateToHomeIfUserHasPermission(): Promise<void> {
    if (!this.auth.isGranted('view', 'dashboard')) {
      localStorage.clear();
      this.user.refreshCurrentUser();

      return void this.toast.danger('Você não tem permissão para acessar esses recursos.', 'Oops...');
    }

    await this.router.navigateByUrl(environment.config.redirectToWhenAuthenticated);
  }

  //#endregion

}
