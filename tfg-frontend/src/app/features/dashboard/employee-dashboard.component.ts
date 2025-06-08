import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { RouterModule } from '@angular/router';
import { EmployeeSidebarComponent } from '../../components/employee-sidebar.component';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css',
  imports: [
    RouterModule,EmployeeSidebarComponent
  ],
})
export class EmployeeDashboardComponent {

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
      alert(this.fichajeStatus);
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
            this.fichajeStatus = 'Check-in registrado.';
            alert(this.fichajeStatus);
          },      
            error: () => {
              this.fichajeStatus = 'Error al hacer check-in.'
              alert(this.fichajeStatus);
            }
          });
        } else if (!ultimo.checkOut) {
          // Tiene check-in sin check-out → Check-out
          this.recordService.checkOut(this.userId!).subscribe({
            next: () => {
            sessionStorage.setItem('checkInDone', 'false');
            this.checkInDone = false;
            this.fichajeStatus = 'Check-out registrado.';
            alert(this.fichajeStatus);
          },
            error: () => {
              this.fichajeStatus = 'Error al hacer check-out.'
              alert(this.fichajeStatus);
            }
          });
        } else {
          // Ya tiene check-in y check-out
          this.fichajeStatus = 'Ya se ha fichado hoy.';
          alert(this.fichajeStatus);
        }
      },
      error: () => {
        this.fichajeStatus = 'No se pudo recuperar tu historial de fichajes.'
        alert(this.fichajeStatus);
      }
      
    });
  }


  logout(): void {
    sessionStorage.clear();
    this.authService.logout();
  }
}