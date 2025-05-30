import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FormsModule } from '@angular/forms';
import { UsersComponent } from './features/users/users.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './features/login/login.component';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from './components/admin-sidebar.component';
import { RecordsComponent } from './features/records/records.component';
import { EmployeeSidebarComponent } from './components/employee-sidebar.component';

@NgModule({
  declarations: [AppComponent, UsersComponent, RecordsComponent],
  imports: [BrowserModule, 
            HttpClientModule, 
            FormsModule, 
            AppRoutingModule, 
            LoginComponent,
            RouterModule,
            AdminSidebarComponent,
            EmployeeSidebarComponent
          ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


