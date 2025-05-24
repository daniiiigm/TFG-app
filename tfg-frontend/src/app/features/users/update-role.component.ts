import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router, RouterModule } from '@angular/router';
import { AdminSidebarComponent } from 'src/app/components/admin-sidebar.component';
import { RecordService } from 'src/app/services/record.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-update-role',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminSidebarComponent],
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.css']
})
export class UpdateRoleComponent implements OnInit {
  users: User[] = [];
  successMessage = '';
  errorMessage = '';

  paginatedUsers: User[] = [];

  currentPage = 1;
  itemsPerPage = 15;
  totalPages = 0;
  pagesArray: number[] = [];

  userId: number | null = null;
  fichajeStatus: string = '';
  checkInDone: boolean = false;

  constructor(private userService: UserService, private recordService: RecordService, private authService: AuthService, private router: Router) {}

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

  updateRole(userId: number, newRole: string): void {
    this.userService.updateUserRole(userId, newRole as 'ADMIN' | 'EMPLOYEE').subscribe({
      next: () => this.successMessage = `Rol actualizado para el usuario ${userId}.`,
      error: () => this.errorMessage = 'Error al actualizar el rol.'
    });
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
    localStorage.clear();
    this.authService.logout();
  }

  verUsuarios(): void{
    this.router.navigate(['/user']);
  }
}
