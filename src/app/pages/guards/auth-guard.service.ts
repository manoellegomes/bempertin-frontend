import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
      if (sessionStorage['token'] || localStorage['token']) {
        return true;
      }

      if (!this.router.url.includes('homepage')) {
        this.router.navigate(['/homepage']);
      }
      
      return false;
    }

}
