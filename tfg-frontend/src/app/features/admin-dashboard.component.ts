import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  imports: [
    RouterModule
  ],
})
export class AdminDashboardComponent {

  constructor(private authService: AuthService, private router: Router) {}


  logout(): void {
    localStorage.clear();
    this.authService.logout();
  }
  

}