import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSnackBarModule} from '@angular/material';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {TranslateModule} from '@ngx-translate/core';
import 'hammerjs';

import {FuseModule} from '@fuse/fuse.module';
import {FuseSharedModule} from '@fuse/shared.module';
import {FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule} from '@fuse/components';

import {fuseConfig} from 'app/fuse-config';

import {FakeDbService} from 'app/fake-db/fake-db.service';
import {AppComponent} from 'app/app.component';
import {AppStoreModule} from 'app/store/store.module';
import {LayoutModule} from 'app/layout/layout.module';
import {SnotifyModule, SnotifyService, ToastDefaults} from 'ng-snotify';
import {AuthGuard} from './guard/auth.guard';
import {RolesGuardService} from './guard/roles-guard.service';
import {PusherService} from './services/pusher.service';
import {ChangePasswordComponent} from './Matcha_Admin/components/users/change-password/change-password.component';
import {UsersService} from './Matcha_Admin/components/users/users.service';

const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: 'admin',
    loadChildren: './Matcha_Admin/Matcha_Admin.module#Matcha_AdminModule',
    canActivate: [AuthGuard],
    data: {title: 'Admin', roles: ['admin', 'user']}
  },
  {
    path: '**', redirectTo: 'admin/smshistory',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {title: ''}
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),

    TranslateModule.forRoot(),
    InMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true
    }),

    // Material moment date module
    MatMomentDateModule,

    // Material
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,

    // Fuse modules
    FuseModule.forRoot(fuseConfig),
    FuseProgressBarModule,
    FuseSharedModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,

    // App modules
    LayoutModule,
    AppStoreModule,
    SnotifyModule,
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    AuthGuard,
    RolesGuardService,
    {provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,
    PusherService,
    UsersService
  ],
  entryComponents: [
    ChangePasswordComponent
  ]
})
export class AppModule {
}
