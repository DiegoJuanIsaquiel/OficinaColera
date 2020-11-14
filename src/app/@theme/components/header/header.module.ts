import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NbActionsModule, NbContextMenuModule, NbIconModule, NbUserModule } from '@nebular/theme';

import { ThemeModule } from '../../theme.module';
import { HeaderComponent } from './header.component';

@NgModule({
  imports: [
    CommonModule,
    NbUserModule,
    NbActionsModule,
    NbIconModule,
    NbContextMenuModule,
    ThemeModule,
  ],
  exports: [
    HeaderComponent,
  ],
  declarations: [
    HeaderComponent,
  ],
})
export class HeaderModule {}
