import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

import {FuseUtils} from '@fuse/utils';

import {User} from 'app/models/user';
import {map} from 'rxjs/operators';
import {ApiTokenService} from 'app/services/token.service';
import {ApiAuthService} from 'app/services/auth.service';
import * as Constants from 'app/app.const';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class UsersService implements Resolve<any> {

  onUsersChanged: BehaviorSubject<any>;
  onSelectedUsersChanged: BehaviorSubject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onRolesChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onPageChanged: Subject<any>;
  onFilterChanged: Subject<any>;
  private totalCountsubject = new Subject<any>();
  selectedRoleUsers: any[] = [];

  users: User[];
  userRoles: any[];
  selectedUsers: string[] = [];
  userTotalCount: number;
  pageNo = 1;
  numPerPage = 10;

  searchText: string;
  filterBy: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + this.token.get(),
    })
  };

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */

  constructor(
    private _httpClient: HttpClient,
    private token: ApiTokenService,
    private auth: ApiAuthService,
    private _matSnackBar: MatSnackBar
  ) {
    // Set the defaults
    this.onUsersChanged = new BehaviorSubject([]);
    this.onSelectedUsersChanged = new BehaviorSubject([]);
    this.onUserDataChanged = new BehaviorSubject([]);
    this.onRolesChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onPageChanged = new Subject();
    this.onFilterChanged = new Subject();
    this.userTotalCount = 0;
    this.searchText = 'null';
    this.onFilterChanged.subscribe(filter => {
      this.filterBy = filter;
      this.getUsers(this.pageNo, this.numPerPage, this.searchText);
    });

    this.onPageChanged.subscribe(pagedata => {
      this.pageNo = pagedata.pageNo;
      this.numPerPage = pagedata.numPerPage;
      this.getUsers(this.pageNo, this.numPerPage, this.searchText);
    });
  }

  private jwt(): any {
    const tokenStr = this.token.get();
    if (tokenStr) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + tokenStr);
      return headers;
    } else {
      return '';
    }
  }

  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {

      Promise.all([
        // this.getRoles(),
        this.getUsers(this.pageNo, this.numPerPage),
        // this.getCurrentUserData()
      ]).then(
        ([files]) => {
          resolve();
        },
        reject
      );
    });
  }

  /**
   * Get users
   *
   * @returns {Promise<any>}
   */
  getUsers(pageNo = null, numPerPage = null, search = null): Promise<any> {
    let params = new HttpParams();
    params = params.set('start', pageNo);
    params = params.set('numPerPage', numPerPage);
    params = params.set('search', search);

    return new Promise((resolve, reject) => {
        this._httpClient.get(Constants.API_URL + '/users', {params: params, headers: this.jwt()})
          .subscribe(
            (response: any) => {
              this.users = response['users'];
              this.userTotalCount = response['totalCount'];
              this.totalCountsubject.next(this.userTotalCount);
              this.onUsersChanged.next(this.users);
              resolve(this.users);
            },
            (error: any) => {
              if (error.status == 301) {
                this.auth.logout();
              }
            });
      }
    );
  }

  getAllUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(Constants.API_URL + '/users', {headers: this.jwt()})
        .subscribe((response: any) => {
          resolve(response);
        }, error => {
          console.log(error);
        });
    });
  }

  getUsersById(userID): Promise<any> {
    return new Promise((resolve, reject) => {
        this._httpClient.get(Constants.API_URL + '/users/user?userId=' + userID, {headers: this.jwt()})
          .subscribe((response: any) => {
              resolve(response);
            },
            (error: any) => {
              if (error.status === 301) {
                this.auth.logout();
              }
            });
      }
    );
  }

  /**
   * Toggle selected user by id
   *
   * @param id
   */
  toggleSelectedUser(id): void {
    // First, check if we already have that user as selected...
    if (this.selectedUsers.length > 0) {
      const index = this.selectedUsers.indexOf(id);

      if (index !== -1) {
        this.selectedUsers.splice(index, 1);

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedUsers.push(id);

    // Trigger the next event
    this.onSelectedUsersChanged.next(this.selectedUsers);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {
    if (this.selectedUsers.length > 0) {
      this.deselectUsers();
    }
    else {
      this.selectUsers();
    }
  }

  /**
   * Select users
   *
   * @param filterParameter
   * @param filterValue
   */
  selectUsers(filterParameter?, filterValue?): void {
    this.selectedUsers = [];

    // If there is no filter, select all users
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedUsers = [];
      this.users.map(user => {
        this.selectedUsers.push(user.id);
      });
    }

    // Trigger the next event
    this.onSelectedUsersChanged.next(this.selectedUsers);
  }

  /**
   * Create User
   *
   * @param user
   * @returns {Promise<any>}
   */
  createUser(user): Promise<any> {
    return new Promise((resolve, reject) => {

      this._httpClient
        .post(Constants.API_URL + '/users/create', {...user}, {headers: this.jwt()})
        .subscribe(
          response => {
            // this.setUserRole(user.email, user.userRole);
            // this.getUsers(this.pageNo, this.numPerPage, this.filterBy);
            resolve(response);
          },
          error => {
            if (error.status == 301) {
              this.auth.logout();
            }
          }
        );
    });
  }

  /**
   * Update User
   *
   * @param user
   * @returns {Promise<any>}
   */
  updateUser(user): Promise<any> {
    return new Promise((resolve, reject) => {

      this._httpClient
        .post(Constants.API_URL + '/users/update', {...user}, {headers: this.jwt()})
        .subscribe(
          response => {
            // this.getUsers(this.pageNo, this.numPerPage, this.filterBy);
            resolve(response);
          },
          error => {
            if (error.status == 301) {
              this.auth.logout();
            }
          }
        );
    });
  }

  /**
   * Active User
   *
   * @param user
   * @returns {Promise<any>}
   */
  activeUser(userId, status): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(Constants.API_URL + '/api/activeUser', {
          id: userId,
          active_status: status,
        }, {headers: this.jwt()})
        .subscribe(
          response => {
            resolve(response);
          },
          error => {
            if (error.status == 301) {
              this.auth.logout();
            }
          }
        );
    });
  }

  updateUserPassword(userId, password): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(Constants.API_URL + '/users/updatePassword', {
          id: userId,
          password: password,
        }, {headers: this.jwt()})
        .subscribe(
          response => {
            resolve(response);
          },
          error => {
            if (error.status == 301) {
              this.auth.logout();
            }
          }
        );
    });
  }

  setUserRole(email, userRole): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(Constants.API_URL + '/api/setUserRole', {
          email: email,
          userRole: userRole,
        }, {headers: this.jwt()})
        .subscribe(
          response => {
            // this.getCurrentUserData();
            this.getUsers(this.pageNo, this.numPerPage);
            resolve(response);
          },
          error => {
            if (error.status == 301) {
              this.auth.logout();
            }
          }
        );
    });
  }

  getRoles(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(Constants.API_URL + '/getRoleNames', {headers: this.jwt()})
        .subscribe(
          (response: any) => {
            this.userRoles = response;
            this.onRolesChanged.next(this.userRoles);
            resolve(response);
          },
          error => {
            if (error.status == 301) {
              this.auth.logout();
            }
          }
        );
    });
  }

  /**
   * Deselect users
   */
  deselectUsers(): void {
    this.selectedUsers = [];

    // Trigger the next event
    this.onSelectedUsersChanged.next(this.selectedUsers);
  }


  deleteUser(user): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(Constants.API_URL + '/api/deleteUser', {id: user.id}, {headers: this.jwt()})
        .subscribe(
          response => {

            this.getUsers(this.pageNo, this.numPerPage, this.searchText);

            resolve(response);
          },
          error => {
            if (error.status == 301) {
              this.auth.logout();
            }
          }
        );
    });
  }


  /**
   * Delete selected users
   */
  deleteSelectedUsers(): void {
    for (const userId of this.selectedUsers) {
      const user = this.users.find(_user => {
        return _user.id === userId;
      });
      const userIndex = this.users.indexOf(user);
      this.users.splice(userIndex, 1);
    }
    this.onUsersChanged.next(this.users);
    this.deselectUsers();
  }

  uploadAvatarFile(file: any): Promise<any> {
    let formData: FormData = new FormData();
    formData.append('avatar', file);
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(Constants.API_URL + '/imageUpload', formData, {headers: this.jwt()})
        .subscribe(
          response => {
            resolve(response);
          },
          error => {
            if (error.status == 301) {
              this.auth.logout();
            }
            this._matSnackBar.open('Error, ' + error.error['message'], 'OK', {
              verticalPosition: 'top',
              duration: 3500
            });
          }
        );
    });
  }

}
