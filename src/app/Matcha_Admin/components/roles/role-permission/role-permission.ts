import {Component, OnInit, ViewEncapsulation, Input} from '@angular/core';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {MatTableDataSource, MatPaginator, MatSort, MatSnackBar} from '@angular/material';
import {RoleService} from '../role.service';
import {FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import {Role} from 'app/models/role';
import {FuseUtils} from '../../../../../@fuse/utils';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.html',
  styleUrls: ['./role-permission.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RolePermissionComponent implements OnInit {


    permissions: any[] = [];
    roleForm: FormGroup;
    role: Role;
    selectedPermissions: any[] = [];
    checkboxes: {};
    apiflag = true;
    constructor(
        private _roleService: RoleService,
        private _formBuilder: FormBuilder,
        private _matSnackBar: MatSnackBar,
        private router: Router,
        private activatedRoute: ActivatedRoute
    )
    {
        this.role = new Role();
        this.role.permission_ids = [];
        this.getPermissionList();
        this.activatedRoute.params.subscribe(params => {
            if (params['roleID']) {
                this.apiflag = false;
                this._roleService.getRoleById(params['roleID']).then(res => {
                    this.role = res['roledata'];
                    this.apiflag = true;
                    this.roleForm = this._formBuilder.group({
                        role_name        : [this.role.name, Validators.required]
                    });
                });
            }
        });
    }

    ngOnInit(): void {
        this.roleForm = this._formBuilder.group({
            role_name        : [this.role.name, Validators.required],
            // permission_ids: [this.role.permission_ids, Validators.required],
        });
        this.selectedPermissions = [];
    }

    getRoleList(): void {
        this._roleService.getRoles().then(
            res => {

            }
        ).catch( e => {
            console.log(e);
        });
    }

    getPermissionList(): void {
        this._roleService.getPermissions().then(
            res => {
                this.permissions = res['data'];
                this.checkboxes = {};
                this.selectedPermissions = [];
                res['data'].map(permission => {
                    this.checkboxes[permission.id] = false;
                });
                // console.log(this.permissions);
            }
        ).catch( e => {
            console.log(e);
        });
    }

    onSelectedChange(roleid, $event): void {

        if ($event.checked) {
            this.role.permission_ids.push(roleid);
        } else {
            const index = this.role.permission_ids.indexOf(roleid);
            if (index > -1) {
                this.role.permission_ids.splice(index, 1);
            }
        }
    }

    addRole(): void {
        if (this.role.id) {
            this._roleService.updateRole(this.role)
                .then(() => {
                    this._matSnackBar.open('Role Updated', 'OK', {
                        verticalPosition: 'top',
                        duration        : 3500
                    });
                    this.router.navigate(['/admin/roles']);
                });
        } else {
            this._roleService.addRole(this.role)
                .then(() => {
                    this._matSnackBar.open('New Role added', 'OK', {
                        verticalPosition: 'top',
                        duration        : 3500
                    });
                    this.router.navigate(['/admin/roles']);
                });
        }

    }


}
