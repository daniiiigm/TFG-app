import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { RouterModule } from '@angular/router';
import { EmployeeSidebarComponent } from '../../components/employee-sidebar.component';
import { User } from 'src/app/models/user.model';
import { DocumentService } from 'src/app/services/document.service';
import { CommonModule } from '@angular/common';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts'; 
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css',
  imports: [
    RouterModule,EmployeeSidebarComponent,CommonModule,NgChartsModule
  ],
})
export class EmployeeDashboardComponent {

  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Horas trabajadas',
        data: [],
        fill: true,
        tension: 0.3,
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  lastFiveDays: { fecha: string, fichado: boolean }[] = [];

  totalRecords: number = 0;
  
  totalDocuments: number = 0;

  user: User | null = null;

  userId: number | null = null;
  fichajeStatus: string = '';
  checkInDone: boolean = false;
  
  constructor(private authService: AuthService, private router: Router, private recordService: RecordService, private documentService: DocumentService, private userService: UserService) {}

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
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.user = user;
        },
        error: () => {
          console.error('No se pudo cargar el usuario.');
        }
      });
    }
    this.loadTotalDocuments();
    this.loadRecordsLastFiveDays();
    this.loadWorkHoursChart();
    this.loadTotalRecords();
  }

  loadTotalRecords(): void {
    if (!this.userId) return;

    this.recordService.getAllRecordsByUser(this.userId).subscribe({
      next: (records) => {
        this.totalRecords = records.length;
      },
      error: () => {
        console.error('No se pudieron cargar los registros del usuario.');
      }
    });
  }

  loadWorkHoursChart(): void {
  if (!this.userId) return;

    this.recordService.getAllRecordsByUser(this.userId).subscribe(records => {
      const today = new Date();
      const last7: { date: string, hours: number }[] = [];

      for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const dateISO = day.toISOString().split('T')[0];

        const recordsOfDay = records.filter(r => {
          const checkInDate = new Date(r.checkIn).toISOString().split('T')[0];
          return checkInDate === dateISO && r.checkOut;
        });

        const totalMs = recordsOfDay.reduce((sum, r) => {
          const checkIn = new Date(r.checkIn).getTime();
          const checkOut = new Date(r.checkOut!).getTime();
          return sum + (checkOut - checkIn);
        }, 0);

        const hours = +(totalMs / 1000 / 60 / 60).toFixed(2);

        last7.push({ date: dateISO, hours });
      }

      this.lineChartData = {
        labels: last7.map(d => {
          const [y, m, d2] = d.date.split('-');
          return `${d2}-${m}`; // formato dd-mm
        }),
        datasets: [
          {
            label: 'Horas trabajadas',
            data: last7.map(d => d.hours),
            fill: true,
            tension: 0.3,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.1)',
            pointBackgroundColor: '#3b82f6'
          }
        ]
      };
    });
  }

  loadRecordsLastFiveDays(): void {
  if (!this.userId) return;

  this.recordService.getAllRecordsByUser(this.userId).subscribe({
    next: (records) => {
      const today = new Date();
      const days = [];

      for (let i = 0; i < 5; i++) {
        const fecha = new Date(today);
        fecha.setDate(today.getDate() - i);
        const fechaISO = fecha.toISOString().split('T')[0];

        const fichado = records.some(r =>
          new Date(r.checkIn).toISOString().split('T')[0] === fechaISO
        );

        days.push({ fecha: fechaISO, fichado });
      }

      this.lastFiveDays = days.reverse(); // Para mostrar desde el más antiguo al más reciente
      },
      error: () => {
        console.error('No se pudieron cargar los registros de los últimos días.');
      }
    });
  }

  loadTotalDocuments(): void {
    this.documentService.getAll().subscribe({
      next: (docs) => {
        this.totalDocuments = docs.length;
      },
      error: () => {
        console.error('No se pudieron cargar los documentos.');
      }
    });
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
            this.loadRecordsLastFiveDays();
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