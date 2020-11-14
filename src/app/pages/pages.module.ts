import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NbInputModule, NbMenuModule } from '@nebular/theme';

import { OneColumnLayoutModule } from '../@theme/layouts/one-column/one-column.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ReactiveFormsModule,
    NbInputModule,
    OneColumnLayoutModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule { }
