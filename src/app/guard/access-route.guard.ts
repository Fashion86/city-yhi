import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ApiTokenService} from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AccessRouteGuard implements CanActivate {
  user: any;
  roles: any[];

  constructor(
    private router: Router,
    private _tokenService: ApiTokenService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let roles = route.data.roles as Array<string>;

    this.user = this._tokenService.getUser();
    if (this.user != null) {
      if (roles && roles.indexOf(this.user.roles[0].name) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
