import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import pt from '@angular/common/locales/pt-PT';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbDatepickerModule, NbDialogModule, NbMenuModule, NbSidebarModule, NbToastrModule, NbWindowModule } from '@nebular/theme';

import { environment } from '../environments/environment';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpAsyncModule } from './modules/http-async/http-async.module';
import { BaseUrlInterceptor } from './modules/http-async/interceptors/base-url.interceptor';
import { BearerTokenInterceptor } from './modules/http-async/interceptors/bearer-token.interceptor';
import { HttpAsyncHeadersInterceptor } from './modules/http-async/interceptors/http-async-headers.interceptor';
import { RefreshTokenInterceptor } from './modules/http-async/interceptors/refresh-token.interceptor';
import { RetryInterceptor } from './modules/http-async/interceptors/retry.interceptor';
import { IsOfflineInterceptor } from './modules/network/interceptors/is-offline.interceptor';
import { NetworkModule } from './modules/network/network.module';

registerLocaleData(pt, 'pt-PT');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    HttpAsyncModule.withConfig({
      baseUrl: environment.api.baseUrl,
      defaultHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      bearerTokenKey: environment.keys.token,
    }),
    NetworkModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-PT' },
    { provide: HTTP_INTERCEPTORS, useClass: IsOfflineInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpAsyncHeadersInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: BearerTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RetryInterceptor, multi: true },
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
