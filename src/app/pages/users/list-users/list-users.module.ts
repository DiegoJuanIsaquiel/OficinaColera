import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbSpinnerModule } from '@nebular/theme';

import { ListUsersComponent } from './list-users.component';

@NgModule({
  imports: [
    CommonModule,
    NbButtonModule,
    NbCardModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule,
    NbSpinnerModule,
  ],
  exports: [
    ListUsersComponent,
  ],
  declarations: [
    ListUsersComponent,
  ],
})
export class ListUsersModule {}
