import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { AdminSidebarComponent } from '../../components/admin-sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  imports: [
    RouterModule,AdminSidebarComponent
  ],
})
export class AdminDashboardComponent implements OnInit{

  userId: number | null = null;
  fichajeStatus: string = '';
  checkInDone: boolean = false;

  constructor(private authService: AuthService, private router: Router, private recordService: RecordService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.recordService.getAllRecordsByUser(this.userId).subscribe({
        next: (records) => {
          const today = new Date().toISOString().split('T')[0];
          const recordsToday = records.filter(r => {
            const checkInDate = new Date(r.checkIn).toISOString().split('T')[0];
            return checkInDate === today;
          });

          const ultimo = recordsToday[recordsToday.length - 1];
          this.checkInDone = !!(ultimo && !ultimo.checkOut);
          sessionStorage.setItem('checkInDone', this.checkInDone.toString());
        },
        error: () => {
          console.error('No se pudieron cargar los registros del usuario.');
        }
      });
    }
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

}