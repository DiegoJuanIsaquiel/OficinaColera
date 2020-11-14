import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
      { path: '**', loadChildren: () => import('../@theme/components/not-found/not-found.module').then(m => m.NotFoundModule) },
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
export class PagesRoutingModule {}
