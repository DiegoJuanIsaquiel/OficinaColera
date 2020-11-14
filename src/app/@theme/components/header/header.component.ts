//#region Imports

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { NbMenuItem } from '@nebular/theme/components/menu/menu.service';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { LayoutService } from '../../../@core/utils';

//#endregion

/**
 * A classe que representa o componente de cabeçalho
 */
@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  //#region Constructor

  /**
   * Construtor padrão
   */
  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    ) { }

  //#endregion

  //#region Private Properties

  /**
   * O evento para escutar e limpar as informações desse componente
   */
  private destroy$: Subject<void> = new Subject<void>();

  //#endregion

  //#region Public Properties

  /**
   * As informações do sub-menu ao clicar na imagem do usuário
   */
  public userMenu: NbMenuItem[] = [{ title: 'Sair', link: '/auth/login', queryParams: { shouldLogout: true } }];

  /**
   * Diz se deve manter a imagem apenas ou todas as informações do usuário
   */
  public userPictureOnly: boolean = false;

  //#endregion

  //#region LifeCycle Events

  /**
   * Metodo executado ao inicializar o componente
   */
  public ngOnInit(): void {
    const { xl } = this.breakpointService.getBreakpointsMap();

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
