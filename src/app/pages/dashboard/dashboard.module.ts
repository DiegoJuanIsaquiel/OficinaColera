import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    NbCardModule,
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule {}
