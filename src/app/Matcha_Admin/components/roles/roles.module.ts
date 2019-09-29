import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule, Routes} from '@angular/router';
import {
    MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule,
    MatSelectModule, MatSortModule
} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';

import {FuseSharedModule} from '@fuse/shared.module';
import {FuseConfirmDialogModule, FuseSidebarModule} from '@fuse/components';

import {RolesComponent} from './roles.component';
import {RoleService} from './role.service';
import {RolePermissionComponent} from './role-permission/role-permission';
import {PermissionFormComponent} from './permission-form/permission-form.component';
import {AccessRouteGuard} from "../../../guard/access-route.guard";

const routes: Routes = [
    {
        path: 'role',
        component: RolesComponent,
        canActivate: [AccessRouteGuard],
        data: {roles:['admin', 'Admin']}
    },
    {
        path: 'role/new',
        component: RolesComponent,
        canActivate: [AccessRouteGuard],
        data: {roles:['admin', 'Admin']}
    },
    {
        path: 'role/:roleID',
        component: RolesComponent,
        canActivate: [AccessRouteGuard],
        data: {roles:['admin', 'Admin']}
    },
    {
        path: 'permission',
        component: RolesComponent,
        canActivate: [AccessRouteGuard],
        data: {roles:['admin', 'Admin']}
    },
    {
        path      : '**',
        redirectTo: 'role'
    }
];

@NgModule({
    declarations: [
        RolesComponent,
        RolePermissionComponent,
        PermissionFormComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatSortModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        CommonModule
    ],
    providers      : [
        RoleService
    ],
    entryComponents: [
        PermissionFormComponent
    ]
})
export class RolesModule {
}
