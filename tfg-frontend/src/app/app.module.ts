import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FormsModule } from '@angular/forms';
import { UsersComponent } from './features/users/users.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './features/login.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent, UsersComponent],
  imports: [BrowserModule, 
            HttpClientModule, 
            FormsModule, 
            AppRoutingModule, 
            LoginComponent,
            RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


