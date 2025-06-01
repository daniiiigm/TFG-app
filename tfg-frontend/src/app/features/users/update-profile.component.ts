import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RecordService } from 'src/app/services/record.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
  standalone: false
})
export class UpdateProfileComponent implements OnInit {
  role: string | null = null;

  showPassword: boolean = false;

  userId: number | null = null;
  fichajeStatus: string = '';
  checkInDone: boolean = false;

  name: string = '';
  surname: string = '';
  password: string = '';

  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private userService: UserService, private router: Router,private recordService: RecordService) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.userId = this.authService.getUserId();
    const saved = sessionStorage.getItem('checkInDone');
    this.checkInDone = saved === 'true';

    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user: User) => {
          this.name = user.name;
          this.surname = user.surname;
          // No cargamos password por seguridad
        },
        error: () => {
          this.errorMessage = 'No se pudieron cargar tus datos.';
        }
      });
    }

  }

  updateProfile(): void {
    if (!this.userId) {
      this.errorMessage = 'No se encontró el ID del usuario.';
      return;
    }

    const body = {
      name: this.name,
      surname: this.surname,
      password: this.password
    };

    this.userService.selfUpdateUser(this.userId, body).subscribe({
      next: () => {
        this.successMessage = 'Datos actualizados correctamente.';
        this.errorMessage = '';
        this.password = '';
      },
      error: () => {
        this.errorMessage = 'Error al actualizar los datos.';
        this.successMessage = '';
      }
    });
  }

  fichar(): void {
    if (!this.userId) {
      this.fichajeStatus = 'Error: Usuario no identificado.';
      return;
    }

    this.recordService.getAllRecordsByUser(this.userId).subscribe({
      next: (records) => {
        const today = new Date().toISOString().split('T')[0];

        const recordsToday = records.filter(r => {
          const checkInDate = new Date(r.checkIn).toISOString().split('T')[0];
          return checkInDate === today;
        });

        const ultimo = recordsToday[recordsToday.length - 1];

        if (!ultimo) {
          // No ha fichado hoy → Check-in
          this.recordService.checkIn(this.userId!).subscribe({
            next: () => {
            sessionStorage.setItem('checkInDone', 'true');
            this.checkInDone = true;
            this.fichajeStatus = 'Check-in registrado correctamente.';
          },  
            error: () => this.fichajeStatus = 'Error al hacer check-in.'
          });
        } else if (!ultimo.checkOut) {
          // Tiene check-in sin check-out → Check-out
          this.recordService.checkOut(this.userId!).subscribe({
            next: () => {
            sessionStorage.setItem('checkInDone', 'false');
            this.checkInDone = false;
            this.fichajeStatus = 'Check-out registrado correctamente.';
          },
            error: () => this.fichajeStatus = 'Error al hacer check-out.'
          });
        } else {
          // Ya tiene check-in y check-out
          this.fichajeStatus = 'Ya has fichado entrada y salida hoy.';
        }
      },
      error: () => this.fichajeStatus = 'No se pudo recuperar tu historial de fichajes.'
    });
  }

  logout(): void {
    sessionStorage.clear();
    this.authService.logout();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
