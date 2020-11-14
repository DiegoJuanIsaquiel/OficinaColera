import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule } from '@nebular/theme';

import { NotFoundComponent } from './not-found.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: NotFoundComponent }]),
    NbCardModule,
    NbButtonModule,
  ],
  exports: [
    NotFoundComponent,
  ],
  declarations: [
    NotFoundComponent,
  ],
})
export class NotFoundModule {}
