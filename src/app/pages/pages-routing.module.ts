import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GrantedGuard } from '../guards/granted/granted.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';

/**
 * Verifica se o usuário tem a permissão correta para acessar a rota.
 * É configurado dentro do app.module.ts
 */
export const grantedRoute = (key: string) => ({
  canActivate: [GrantedGuard],
  data: { keyToCheck: key, routeToRedirectWhenHasNoPermission: '/pages' },
});

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        ...grantedRoute('user'),
      },
      {
        path: '**',
        loadChildren: () => import('../@theme/components/not-found/not-found.module').then(m => m.NotFoundModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class PagesRoutingModule {
}
