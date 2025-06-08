import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { RecordService } from '../../services/record.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Record } from 'src/app/models/record.model';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrl: './user.component.css',
    standalone: false
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = [];

  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 0;
  pagesArray: number[] = [];

  userId: number | null = null;
  fichajeStatus: string = '';
  checkInDone: boolean = false;

  editUser: any = {};
  showEditModal = false;

  selectedUserRecords: Record[] = [];
  showRecordsModal: boolean = false;
  selectedUserName: string = '';

  constructor(private authService: AuthService, private userService: UserService, private router: Router,private recordService: RecordService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.userId = this.authService.getUserId();
    const saved = sessionStorage.getItem('checkInDone');
    this.checkInDone = saved === 'true';
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      data => {
        this.users = data;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.updatePaginatedUsers();
      },
      error => console.error('Error fetching users', error)
    );
  }

  updatePaginatedUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        this.loadUsers(); // refresca usuarios y paginación
        this.currentPage = 1; // opcional: volver a la página 1
      },
      error => console.error('Error deleting user', error)
    );
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

  verUsuarios(): void{
    this.router.navigate(['/user']);
  }

  openEditModal(user: User): void {
  this.userId = user.id;
  this.editUser = { ...user }; // Copia para edición
  this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editUser = {};
  }

  submitEdit(): void {
    if (!this.userId) return;

    this.userService.updateUser(this.userId, this.editUser).subscribe({
      next: () => {
        this.loadUsers(); // Refresca lista
        this.closeEditModal();
      },
      error: err => console.error('Error al actualizar usuario', err)
    });
  }

  openRecordsModal(user: User): void {
    if (!user.id) return;

    this.selectedUserName = `${user.name} ${user.surname}`;
    this.recordService.getAllRecordsByUser(user.id).subscribe({
      next: (records) => {
        // Ordena de más reciente a más antigua
        this.selectedUserRecords = records.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
        this.showRecordsModal = true;
      },
      error: (err) => {
        alert('Error al obtener los registros del usuario');
        console.error(err);
      }
    });
  }

  closeRecordsModal(): void {
    this.showRecordsModal = false;
    this.selectedUserRecords = [];
    this.selectedUserName = '';
  }

}
