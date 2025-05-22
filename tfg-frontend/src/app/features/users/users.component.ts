import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

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
  itemsPerPage = 13;
  totalPages = 0;
  pagesArray: number[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
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
}
