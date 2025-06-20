import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UpdateUserDTO, UserRequestDTO, Role, SelfUpdateDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = '/api/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: UserRequestDTO): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/create`, user);
  }

  updateUser(id: number, user: UpdateUserDTO): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update/${id}`, user);
  }

  updateUserRole(userId: number, newRole: 'ADMIN' | 'EMPLOYEE'): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/update-rol/${userId}`, newRole, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  selfUpdateUser(userId: number, body: { name: string; surname: string; password: string }) {
    return this.http.put<User>(`${this.apiUrl}/self-update/${userId}`, body);
  }
}