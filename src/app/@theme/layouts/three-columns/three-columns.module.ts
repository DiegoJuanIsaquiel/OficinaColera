import { NgModule } from '@angular/core';
import { NbLayoutModule, NbSidebarModule } from '@nebular/theme';

import { FooterModule } from '../../components/footer/footer.module';
import { HeaderModule } from '../../components/header/header.module';
import { ThreeColumnsLayoutComponent } from './three-columns.layout';

@NgModule({
  imports: [
    NbLayoutModule,
    HeaderModule,
    NbSidebarModule,
    FooterModule,
  ],
  exports: [
    ThreeColumnsLayoutComponent,
  ],
  declarations: [
    ThreeColumnsLayoutComponent,
  ],
})
export class ThreeColumnsLayoutModule {}
