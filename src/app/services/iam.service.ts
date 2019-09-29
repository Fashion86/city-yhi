import {Injectable} from '@angular/core';
import {ApiTokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ApiIamService {

  roles: any[] = [];
  user: any;

  constructor(private tokenSerivce: ApiTokenService) {
  }

  isRole = (roles) => {

    this.user = this.tokenSerivce.getUser();

    if (this.user != null) {
      this.roles = this.user.roles[0].name;

      if (this.roles.indexOf('admin') !== -1 || this.roles.indexOf('Admin') !== -1) {
        return true;
      } else {
        return roles.some((role) => {
          return this.roles.indexOf(role) !== -1;
        });
      }
    }
  };
}
