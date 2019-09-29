import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import {fuseAnimations} from '../../../../@fuse/animations';
import {MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MatDialog, MatSnackBar} from '@angular/material';
import {RoleService} from './role.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseConfirmDialogComponent} from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {FormGroup} from '@angular/forms';
import {PermissionFormComponent} from './permission-form/permission-form.component';
import {Role} from '../../../models/role';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RolesComponent implements OnInit {

    selected: string;
    roles: any[] = [];
    permissions: any[] = [];
    displayedColumns = ['id', 'name', 'guard_name', 'created_at', 'updated_at', 'buttons'];
    roleID: number;
    pageName: string;
    backhandle: boolean;
    editRole: Role;
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _roleService: RoleService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public _matDialog: MatDialog,
        private _matSnackBar: MatSnackBar
    )
    {

        this.roleID = null;
        this.backhandle = false;
        if (this.router.url === '/admin/roles/role') {
            this.selected = 'role';
            this.pageName = 'Roles';
            this.getRoleList();
        } else if (this.router.url === '/admin/roles/permission') {
            this.selected = 'permission';
            this.pageName = 'Permissions';
            this.getPermissionList();
        } else if (this.router.url === '/admin/roles/role/new') {
            this.pageName = 'New Role';
            this.backhandle = true;
        }

        this.activatedRoute.params.subscribe(params => {
            if (params['roleID']) {
                this.roleID = parseInt(params['roleID']);
                this.pageName = 'Edit Role';
                this.backhandle = true;
            }
        });
    }

    ngOnInit(): void {

    }

    onSelect(name): void {
        this.selected = name;
        this.router.navigate(['/admin/roles/' + name]);
    }

    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    getRoleList(): void {
        this._roleService.getRoles().then(
            res => {
                this.roles = res['data'];
                if (this.selected === 'role') {
                    this.dataSource = new MatTableDataSource(this.roles);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
            }
        ).catch( e => {
            console.log(e);
        });
    }

    getPermissionList(): void {
        this._roleService.getPermissions().then(
            res => {
                this.permissions = res['data'];
                if (this.selected === 'permission') {
                    this.dataSource = new MatTableDataSource(this.permissions);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
            }
        ).catch( e => {
            console.log(e);
        });
    }

    editPermission(data = null): void
    {
        // when click role list
        if (this.selected === 'role') {
            this.editRole = data;
            this.router.navigate(['/admin/roles/role/' + data.id]);
            return;
        }

        // when click permission list
        let action = 'edit';
        if (!data) {
            action = 'new';
        }
        this.dialogRef = this._matDialog.open(PermissionFormComponent, {
            panelClass: 'user-form-dialog',
            data      : {
                permission: data,
                action : action
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                switch ( actionType )
                {
                    case 'save':
                        this._roleService.updatePermission(response[1]).then( res => {
                            this.getPermissionList();
                            this._matSnackBar.open('Permission updated', 'OK', {
                                verticalPosition: 'top',
                                duration        : 2000
                            });
                        }).catch(err => {
                            this._matSnackBar.open('Permission update falied', 'OK', {
                                verticalPosition: 'top',
                                duration        : 2000
                            });
                        });
                        break;
                    case 'new':
                        this._roleService.addPermission(response[1]).then( res => {
                            this.getPermissionList();
                            this._matSnackBar.open('Permission added', 'OK', {
                                verticalPosition: 'top',
                                duration        : 2000
                            });
                        }).catch(err => {
                            this._matSnackBar.open('Permission add falied', 'OK', {
                                verticalPosition: 'top',
                                duration        : 2000
                            });
                        });
                        break;
                }
            });
    }

    deleteData(data): void{
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                if (this.selected === 'role') {
                    this._roleService.deleteRole(data).then( res => {
                        this.getRoleList();
                        this._matSnackBar.open('Role deleted', 'OK', {
                            verticalPosition: 'top',
                            duration        : 2000
                        });
                    }).catch(err => {
                        this._matSnackBar.open('Failed Role delete', 'OK', {
                            verticalPosition: 'top',
                            duration        : 2000
                        });
                    });
                } else {
                    this._roleService.deletePermission(data).then( res => {
                        this.getPermissionList();
                        this._matSnackBar.open('Permission deleted', 'OK', {
                            verticalPosition: 'top',
                            duration        : 2000
                        });
                    }).catch(err => {
                        this._matSnackBar.open('Failed Permission delete', 'OK', {
                            verticalPosition: 'top',
                            duration        : 2000
                        });
                    });
                }


            }
            this.confirmDialogRef = null;
        });
    }
}
