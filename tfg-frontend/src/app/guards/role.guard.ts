import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const userRole = localStorage.getItem('role');

    if (userRole === expectedRole) {
      return true;
    }

    if (userRole == 'ADMIN'){
        this.router.navigate(['/admin-dashboard']);
    } else {
        this.router.navigate(['/employee-dashboard']);
    }
    
    return false;
  }
}
