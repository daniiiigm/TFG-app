import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { AdminSidebarComponent } from '../../components/admin-sidebar.component';
import { UserService } from 'src/app/services/user.service';
import { DocumentService } from 'src/app/services/document.service';
import { User } from 'src/app/models/user.model';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  imports: [
    RouterModule,AdminSidebarComponent, CommonModule, NgChartsModule
  ],
})
export class AdminDashboardComponent implements OnInit{

  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Fichajes por día',
        fill: true,
        tension: 0.3,
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      }
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    }
  };

  lastFiveDays: { fecha: string, fichado: boolean }[] = [];

  admins: User[] = [];

  totalEmployees: number = 0;

  recordsToday: number = 0;

  totalDocuments: number = 0;
  
  userId: number | null = null;
  fichajeStatus: string = '';
  checkInDone: boolean = false;

  constructor(private authService: AuthService, private router: Router, private recordService: RecordService, private userService: UserService, private documentService: DocumentService) {}

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
    this.loadTotalEmployees();
    this.loadTodayRecords();
    this.loadTotalDocuments();
    this.loadAdmins();
    this.loadRecordsLastFiveDays();
    this.loadRecordsChart();
  }

  loadRecordsChart(): void {
    this.recordService.getAllRecords().subscribe(records => {
      const today = new Date();
      const last7 = [];

      for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const dateStr = day.toISOString().split('T')[0];

        const count = records.filter(r =>
          new Date(r.checkIn).toISOString().split('T')[0] === dateStr
        ).length;

        last7.push({ date: dateStr, count });
        this.lineChartData = {
          labels: last7.map(d => {
            const [year, month, day] = d.date.split('-');
            return `${day}-${month}`;
          }),
          datasets: [
            {
              label: 'Fichajes por día',
              data: last7.map(d => d.count),
              fill: true,
              tension: 0.3,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59,130,246,0.1)',
              pointBackgroundColor: '#3b82f6'
            }
          ]
        };
      }
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

  loadAdmins(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.admins = users.filter(user => user.role === 'ADMIN');
      },
      error: () => {
        console.error('No se pudieron cargar los administradores.');
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

  loadTotalEmployees(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.totalEmployees = users.length;
    });
  }

  loadTodayRecords(): void {
    this.recordService.getAllRecords().subscribe({
      next: (records) => {
        const today = new Date().toISOString().split('T')[0];
        this.recordsToday = records.filter(record => {
          const checkInDate = new Date(record.checkIn).toISOString().split('T')[0];
          return checkInDate === today;
        }).length;
      },
      error: () => {
        console.error('No se pudieron cargar los registros de hoy.');
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