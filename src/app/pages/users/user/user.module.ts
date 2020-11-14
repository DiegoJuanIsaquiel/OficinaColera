import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbToggleModule } from '@nebular/theme';

import { CreateUserComponent } from './create-user.component';
import { UpdateUserComponent } from './update-user.component';

@NgModule({
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    RouterModule,
    MatInputModule,
    CommonModule,
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    NbInputModule,
    NbSelectModule,
    NbToggleModule,
    NbFormFieldModule,
  ],
  exports: [
    UpdateUserComponent,
    CreateUserComponent,
  ],
  declarations: [
    UpdateUserComponent,
    CreateUserComponent,
  ],
})
export class UserModule {}
