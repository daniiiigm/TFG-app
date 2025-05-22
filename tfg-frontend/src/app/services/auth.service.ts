import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string, role: string, userId: number}>('http://localhost:8080/api/auth/login', 
      { email, password }, 
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
      }
    ).pipe(
      tap(response => {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('role', response.role);
        sessionStorage.setItem('userId', response.userId.toString());
      }),
      map(() => {}) // importante: para que next() se dispare sin error
    );
  }

  saveToken(token: string): void {
    sessionStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    sessionStorage.setItem('role', payload.role);
    sessionStorage.setItem('userId', payload.userId);
  }

  getRole(): string | null {
    return sessionStorage.getItem('role');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUserId(): number | null {
    const id = sessionStorage.getItem('userId');
    return id ? Number(id) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (e) {
      return true;
    }
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch (e) {
      console.error('Error decodificando el token:', e);
      return null;
    }
  }
}
