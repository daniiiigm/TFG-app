import { Component, OnInit } from '@angular/core';
import { Record } from '../../models/record.model';
import { RecordService } from '../../services/record.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { RecordDTO } from '../../models/record.model';

@Component({
  selector: 'app-employee-records',
  templateUrl: './records.component.html',
  styleUrl: './records.component.css',
  standalone: false,
})
export class RecordsComponent implements OnInit {
  role: string | null = null;

  editCheckInTime: string = '';
  editCheckOutTime: string = '';
  private editCheckInDate: string = '';
  private editCheckOutDate: string = '';

  records: Record[] = [];
  paginatedRecords: Record[] = [];

  currentPage = 1;
  itemsPerPage = 13;
  totalPages = 0;
  pagesArray: number[] = [];

  userId: number | null = null;
  fichajeStatus: string = '';
  checkInDone: boolean = false;

  errorMessage: string = '';

  showEditModal = false;
  editRecord: { id: number, checkIn: string, checkOut: string | null } = { id: 0, checkIn: '', checkOut: null };

  constructor(private authService: AuthService, private userService: UserService, private router: Router,private recordService: RecordService) {}

  ngOnInit(): void {
    this.role = this.authService.getRole();
    this.userId = this.authService.getUserId();
    const saved = sessionStorage.getItem('checkInDone');
    this.checkInDone = saved === 'true';
    this.fetchRecords();
  }

  fetchRecords(): void {
    if (!this.userId) {
      this.errorMessage = 'No se ha encontrado el ID del usuario.';
      return;
    }

    this.recordService.getAllRecordsByUser(this.userId).subscribe({
      next: (data) => {
        // Ordenar por fecha descendente
        this.records = data.sort(
          (a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime()
        );

        this.totalPages = Math.ceil(this.records.length / this.itemsPerPage);
        this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.updatePaginatedRecords();
      },
      error: () => {
        this.errorMessage = 'Error al obtener los registros.';
      }
    });
  }

  updatePaginatedRecords(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedRecords = this.records.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedRecords();
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

  openEditModal(record: Record): void {
    const checkIn = new Date(record.checkIn);
    this.editCheckInDate = checkIn.toISOString().split('T')[0];
    this.editCheckInTime = checkIn.toTimeString().slice(0, 5);

    if (record.checkOut) {
      const checkOut = new Date(record.checkOut);
      this.editCheckOutDate = checkOut.toISOString().split('T')[0];
      this.editCheckOutTime = checkOut.toTimeString().slice(0, 5);
    } else {
      this.editCheckOutDate = '';
      this.editCheckOutTime = '';
    }

    this.editRecord.id = record.id;
    this.showEditModal = true;
  }
  

  closeEditModal(): void {
    this.showEditModal = false;
    this.editRecord = { id: 0, checkIn: '', checkOut: null };
    this.editCheckInDate = '';
    this.editCheckOutDate = '';
    this.editCheckInTime = '';
    this.editCheckOutTime = '';
  }

  submitEdit(): void {
    if (!this.editRecord.id) return;

    const checkIn = new Date(`${this.editCheckInDate}T${this.editCheckInTime}`);
    const checkOut = this.editCheckOutDate && this.editCheckOutTime
      ? new Date(`${this.editCheckOutDate}T${this.editCheckOutTime}`)
      : null;

    const checkInUTC = new Date(checkIn.getTime() - checkIn.getTimezoneOffset() * 60000);
    const checkOutUTC = checkOut ? new Date(checkOut.getTime() - checkOut.getTimezoneOffset() * 60000) : null;

    const recordDTO = {
      checkIn: checkInUTC,
      checkOut: checkOutUTC
    };

    this.recordService.updateRecord(this.editRecord.id, recordDTO).subscribe({
      next: () => {
        this.fetchRecords();
        this.closeEditModal();
      },
      error: err => console.error('Error al actualizar el registro', err)
    });
  }
}
