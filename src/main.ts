import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import hmrAccept from './app/modules/hmr/hmr-accept';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.hmr) {
  if ('hot' in module) {
    hmrAccept(module);

    bootstrap().catch(err => console.error(err));
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
    console.error('Are you using the --hmr flag for ng serve?');
  }
} else {
  bootstrap().catch(err => console.error(err));
}

