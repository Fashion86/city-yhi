import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FuseUtils} from '@fuse/utils';
import {User} from 'app/models/user';
import {map} from 'rxjs/operators';
import {ApiTokenService} from 'app/services/token.service';
import * as Constants from 'app/app.const';
import {MatSnackBar} from '@angular/material';
import {ApiAuthService} from 'app/services/auth.service';

@Injectable()
export class RoleService {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */

    constructor(
        private _httpClient: HttpClient,
        private _token: ApiTokenService,
        private _auth: ApiAuthService,
        private _matSnackBar: MatSnackBar
    ) {

    }

    private jwt(): any {
        const tokenStr = this._token.get();
        if (tokenStr) {
            const headers = new HttpHeaders().set('Authorization', 'Bearer ' + tokenStr);
            return {headers: headers};
        } else {
            return {headers: ''};
        }
    }

    /**
     * Get roles
     *
     * @returns {Promise<any>}
     */

    getRoles(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(Constants.API_URL + '/roles', this.jwt())
                .subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 301) {
                            this._auth.logout();
                        }
                    }
                );
        });
    }

    getRoleById(roleID): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(Constants.API_URL + '/api/getRole?roleId=' + roleID, this.jwt())
                .subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 301) {
                            this._auth.logout();
                        }
                    }
                );
        });
    }

    getPermissions(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(Constants.API_URL + '/api/getPermissions', this.jwt())
                .subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 301) {
                            this._auth.logout();
                        }
                    }
                );
        });
    }

    addRole(role): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(Constants.API_URL + '/api/addRole', role, this.jwt())
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    error => {
                        if (error.status == 301) {
                            this._auth.logout();
                        }
                        this._matSnackBar.open('Error, ' + error.error['message'], 'OK', {
                            verticalPosition: 'top',
                            duration        : 3500
                        });
                    }
                );
        });
    }

    updateRole(role): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(Constants.API_URL + '/api/updateRole', role, this.jwt())
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    error => {
                        if (error.status == 301) {
                            this._auth.logout();
                        }
                        this._matSnackBar.open('Error, ' + error.error['message'], 'OK', {
                            verticalPosition: 'top',
                            duration        : 3500
                        });
                    }
                );
        });
    }

    deleteRole(role): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(Constants.API_URL + '/api/deleteRole', {id: role.id}, this.jwt())
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 301) {
                            this._auth.logout();
                        }
                    }
                );
        });
    }

    deletePermission(permission): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(Constants.API_URL + '/api/deletePermission', {id: permission.id}, this.jwt())
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 301) {
                            this._auth.logout();
                        }
                    }
                );
        });
    }

    updatePermission(permission): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(Constants.API_URL + '/api/updatePermission', permission, this.jwt())
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 301) {
                            this._auth.logout();
                        }
                    }
                );
        });
    }

    addPermission(permission): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(Constants.API_URL + '/api/addPermission', permission, this.jwt())
                .subscribe(
                    response => {
                        resolve(response);
                    },
                    error => {
                        if (error.status == 301) {
                            this._auth.logout();
                        }
                        this._matSnackBar.open('Error, ' + error.error['error'], 'OK', {
                            verticalPosition: 'top',
                            duration        : 3500
                        });
                    }
                );
        });
    }

    getPermissionsByRole(_roleID): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(Constants.API_URL + '/api/getPermissions', this.jwt())
                .subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 301) {
                            this._auth.logout();
                        }
                    }
                );
        });
    }
}
