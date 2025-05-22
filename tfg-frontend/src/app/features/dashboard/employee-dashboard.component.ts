import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent {

  userId: number | null = null;
  fichajeStatus: string = '';
  checkInDone: boolean | null = false;
  
  constructor(private authService: AuthService, private router: Router, private recordService: RecordService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }


  fichar(): void {
    if (!this.userId) {
      this.fichajeStatus = 'Error: Usuario no identificado.';
      return;
    }

    this.recordService.getRecordsByUser(this.userId).subscribe({
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
            next: () => this.checkInDone = true,       
            error: () => this.fichajeStatus = 'Error al hacer check-in.'
          });
        } else if (!ultimo.checkOut) {
          // Tiene check-in sin check-out → Check-out
          this.recordService.checkOut(this.userId!).subscribe({
            next: () => this.checkInDone = false,
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
    this.authService.logout();
  }
}