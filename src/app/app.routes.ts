import { Routes } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      {
        path: 'users',
        canActivate: [AdminGuard],
        loadChildren: () =>
          import('./user-management/user-management.routes').then(
            (m) => m.userManagementRoutes
          ),
      },
    ],
  },
];