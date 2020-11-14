import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ListUsersComponent } from './list-users/list-users.component';
import { ListUsersModule } from './list-users/list-users.module';
import { CreateUserComponent } from './user/create-user.component';
import { UpdateUserComponent } from './user/update-user.component';
import { UserModule } from './user/user.module';
import { UsersComponent } from './users.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: UsersComponent,
        children: [
          { path: '', component: ListUsersComponent },
          { path: 'create', component: CreateUserComponent },
          { path: ':entityId', component: UpdateUserComponent },
          { path: '**', loadChildren: () => import('../../@theme/components/not-found/not-found.module').then(m => m.NotFoundModule) },
        ],
      },
    ]),
    ListUsersModule,
    UserModule,
  ],
  declarations: [
    UsersComponent,
  ],
})
export class UsersModule {}
