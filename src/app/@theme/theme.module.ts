import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbThemeModule } from '@nebular/theme';

import { CORPORATE_THEME } from './styles/theme.corporate';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { DARK_THEME } from './styles/theme.dark';
import { DEFAULT_THEME } from './styles/theme.default';

@NgModule({
  imports: [
    NbEvaIconsModule,
    CommonModule,
  ],
  exports: [
    CommonModule,
  ],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME],
        ).providers,
      ],
    };
  }
}
