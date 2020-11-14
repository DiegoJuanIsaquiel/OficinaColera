import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbSpinnerModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AuthComponent,
        children: [
          { path: 'login', component: LoginComponent },
          { path: '', redirectTo: 'login', pathMatch: 'full' },
        ],
      },
    ]),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ThemeModule,
    NbLayoutModule,
    NbCardModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbButtonModule,
    NbSpinnerModule,
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
  ],
})
export class AuthModule {}
