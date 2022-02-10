import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NbSecurityModule } from '@nebular/security';
import { NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbPopoverModule, NbSpinnerModule } from '@nebular/theme';
import { AlertDeleteModalModule } from '../../../components/alert-delete-modal/alert-delete-modal.component';
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
    NbInputModule,
    AlertDeleteModalModule,
    NbSecurityModule,
    NbPopoverModule,
    NbIconModule,
  ],
  exports: [
    ListUsersComponent,
  ],
  declarations: [
    ListUsersComponent,
  ],
})
export class ListUsersModule {}
