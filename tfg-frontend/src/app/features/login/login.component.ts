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
  backgrounds = [
    'assets/background1.jpg',
    'assets/background2.jpg',
    'assets/background3.jpg',
    'assets/background4.jpg',
  ];
  index = 0;

  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.changeBackground();
    setInterval(() => this.changeBackground(), 10000); // cada 5 segundos
  }

  changeBackground() {
    document.body.style.backgroundImage = `url(${this.backgrounds[this.index]})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.transition = 'background-image 1s ease-in-out';
    this.index = (this.index + 1) % this.backgrounds.length;
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

