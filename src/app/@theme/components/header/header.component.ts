//#region Imports

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LayoutService } from '../../../@core/utils';
import { UserProxy } from '../../../models/proxys/user.proxy';
import { UserService } from '../../../services/user/user.service';

//#endregion

@Component({
  selector: 'ngx-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  //#region Constructor

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private readonly userService: UserService,
  ) { }

  //#endregion

  //#region Public Properties

  public userMenu: NbMenuItem[] = [{ title: 'Sair', link: '/auth/login', queryParams: { shouldLogout: true } }];

  public userPictureOnly: boolean = false;

  public user: UserProxy | null = null;

  //#endregion

  //#region Private Properties

  private destroy$: Subject<void> = new Subject<void>();

  //#endregion

  //#region LifeCycle Events

  public ngOnInit(): void {
    const { xl } = this.breakpointService.getBreakpointsMap();

    this.user = this.userService.getCurrentUser();

    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);
  }

  /**
   * Metodo executado ao destruir o componente
   */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //#endregion

  //#region Public Methods

  /**
   * Metodo que esconde o menu
   */
  public toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  /**
   * Método que redireciona o usuário para a página inicial
   */
  public navigateHome(): boolean {
    this.menuService.navigateHome();

    return false;
  }

  //#endregion

}
