import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',


  
  imports: [FormsModule] 
})
export class LoginComponent implements OnInit{

  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    document.body.style.backgroundImage = `src/assets/background1.jpg`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.transition = 'background-image 2s ease-in-out';
  }

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

