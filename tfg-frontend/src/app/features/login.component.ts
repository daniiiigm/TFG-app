import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',


  
  imports: [FormsModule] 
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
  this.authService.login(this.email, this.password).subscribe({
    next: () => {
      const role = this.authService.getRole();

      if (role === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else if (role === 'EMPLOYEE') {
        this.router.navigate(['/employee-dashboard']);
      } else {
        this.authService.logout();
      }
    },
    error: (error) => {
      this.errorMessage = 'Invalid email or password';
      console.error('Login error', error);
    }
  });
}
}

