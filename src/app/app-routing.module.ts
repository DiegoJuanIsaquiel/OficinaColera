import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { AuthenticateGuard } from './guards/authenticate/authenticate.guard';

/**
 * As configurações para as rotas que NÃO precisam de autenticação
 */
export const unAuthenticatedRoute = { canActivate: [AuthenticateGuard], data: { routeToRedirect: environment.config.redirectToWhenAuthenticated, unprotectedRoute: true } };

/**
 * As configurações para as rotas que PRECISAM de autenticação
 */
export const authenticatedRoute = { canActivate: [AuthenticateGuard], data: { routeToRedirect: environment.config.redirectToWhenUnauthenticated, protectedRoute: true } };

export const routes: Routes = [
  { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule), ...authenticatedRoute },
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule), ...unAuthenticatedRoute },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
