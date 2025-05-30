import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './features/users/users.component';
import { LoginComponent } from './features/login/login.component';
import { EmployeeDashboardComponent } from './features/dashboard/employee-dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { RegisterUserComponent } from './features/users/register-user.component';
import { UpdateRoleComponent } from './features/users/update-role.component';
import { RecordsComponent } from './features/records/records.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard,RoleGuard], data:{expectedRole: 'ADMIN'} },
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data:{expectedRole: 'ADMIN'} },
  { path: 'register-user', component: RegisterUserComponent, canActivate: [AuthGuard, RoleGuard], data:{expectedRole: 'ADMIN'}},
  { path: 'edit-role', component: UpdateRoleComponent, canActivate: [AuthGuard, RoleGuard], data:{expectedRole: 'ADMIN'}},
  { path: 'employee-dashboard', component: EmployeeDashboardComponent, canActivate: [AuthGuard,RoleGuard], data:{expectedRole: 'EMPLOYEE'} },
  { path: 'records', component: RecordsComponent, canActivate: [AuthGuard] }
  //{ path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

