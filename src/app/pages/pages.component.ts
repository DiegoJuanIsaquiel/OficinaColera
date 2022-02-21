//#region Imports

import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { AuthService } from '../services/auth/auth.service';

//#endregion

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {

  //#region Constructor

  constructor(
    private readonly auth: AuthService,
  ) { }

  //#endregion

  //#region Public Properties

  public menu: NbMenuItem[] = [];

  //#endregion

  //#region LifeCycle Events

  public async ngOnInit(): Promise<void> {
    const can = (permission: string, resource: string, menu: NbMenuItem) => this.auth.isGranted(permission, resource) ? [menu] : [];

    this.menu = [
      ...can('view', 'dashboard', {
        title: 'Início',
        icon: 'home-outline',
        link: '/pages/dashboard',
      }),
      { title: 'Administrativo', group: true },
      ...can('view', 'user', {
        title: 'Usuários',
        icon: 'people',
        children: [
          { title: 'Listar', link: '/pages/users' },
          ...can('create', 'user', { title: 'Criar', link: '/pages/users/create' }),
        ],
      }),
    ];
  }

  //#endregion

}
