import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ApiTokenService} from '../services/token.service';

@Injectable()

export class AfterLoginGuard implements CanActivate {
    constructor(private token: ApiTokenService, private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.token.loggedIn();
    }
}
