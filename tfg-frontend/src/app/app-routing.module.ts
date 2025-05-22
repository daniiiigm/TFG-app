import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './features/users/users.component';
import { LoginComponent } from './features/login.component';
import { EmployeeDashboardComponent } from './features/dashboard/employee-dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard,RoleGuard], data:{expectedRole: 'ADMIN'} },
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data:{expectedRole: 'ADMIN'} },
  { path: 'employee-dashboard', component: EmployeeDashboardComponent, canActivate: [AuthGuard,RoleGuard], data:{expectedRole: 'EMPLOYEE'} },
  //{ path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

