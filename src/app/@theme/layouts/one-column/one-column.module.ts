import { NgModule } from '@angular/core';
import { NbLayoutModule, NbSidebarModule } from '@nebular/theme';

import { FooterModule } from '../../components/footer/footer.module';
import { HeaderModule } from '../../components/header/header.module';
import { OneColumnLayoutComponent } from './one-column.layout';

@NgModule({
  imports: [
    NbLayoutModule,
    HeaderModule,
    NbSidebarModule,
    FooterModule,
  ],
  exports: [
    OneColumnLayoutComponent,
  ],
  declarations: [
    OneColumnLayoutComponent,
  ],
})
export class OneColumnLayoutModule {}
