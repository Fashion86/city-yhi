import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule, Routes} from '@angular/router';
import {
  MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule,
  MatSelectModule, MatTabsModule, MatRadioModule
} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';

import {FuseSharedModule} from '@fuse/shared.module';
import {FuseConfirmDialogModule, FuseSidebarModule} from '@fuse/components';

import {UsersComponent} from './users.component';
import {UsersService} from './users.service';
import {UserListComponent} from './user-list/user-list.component';
import {UserSelectedBarComponent} from './selected-bar/selected-bar.component';
import {UsersMainSidebarComponent} from './sidebars/main/main.component';
import {AuthGuard} from '../../../guard/auth.guard';
import {ProfileComponent} from 'app/Matcha_Admin/components/users/profile/profile.component';
import {AccessRouteGuard} from '../../../guard/access-route.guard';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    resolve: {
      users: UsersService
    },
    canActivate: [AuthGuard],
    data: {roles: ['admin', 'Admin', 'user', 'User', 'officer', 'Officer']}
  },
  {
    path: 'new',
    component: ProfileComponent,
    canActivate: [AccessRouteGuard],
    data: {roles: ['admin', 'Admin']}
  },
  {
    path: ':userid/detail',
    component: ProfileComponent,
    canActivate: [AccessRouteGuard],
    data: {roles: ['admin', 'Admin', 'user', 'User', 'officer', 'Officer']}
  },
];

@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    UserSelectedBarComponent,
    UsersMainSidebarComponent,
    ProfileComponent
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
    MatTabsModule,
    MatRadioModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule
  ],
  providers: [
    UsersService
  ],
  entryComponents: []
})
export class UsersModule {
}
