import { Routes } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';

export const userManagementRoutes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      { path: '', component: UserListComponent },
      { path: 'new', component: UserCreateComponent },
      { path: 'edit/:id', component: UserEditComponent },
    ],
  },
];
