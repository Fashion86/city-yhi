import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {
  MatButtonModule,
  MatChipsModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';
import {MatListModule} from '@angular/material/list';
import {AuthGuard} from '../guard/auth.guard';
import {FuseConfirmDialogModule, FuseSidebarModule} from '@fuse/components';
import {SmshistoryModule} from './components/smshistory/smshistory.module';
import {CohortSmshistoryModule} from './components/cohort-smshistory/cohort-smshistory.module';

const routes: Routes = [
  {
    path: 'users',
    loadChildren: './components/users/users.module#UsersModule',
  },
  {
    path: 'analytics',
    loadChildren: './components/analytics/analytics.module#AnalyticsDashboardModule',
  },
  {
    path: 'smshistory',
    loadChildren: './components/smshistory/smshistory.module#SmshistoryModule',
  },
  {
    path: 'permanent-cohorts',
    loadChildren: './components/cohort-smshistory/cohort-smshistory.module#CohortSmshistoryModule',
  },
  {
    path: '**',
    redirectTo: 'smshistory'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatMenuModule,
    MatDialogModule,
    MatListModule,
    MatProgressSpinnerModule,

    CommonModule,
    FuseConfirmDialogModule,
    FuseSidebarModule
  ],
  providers: [
    AuthGuard,
    SmshistoryModule,
    CohortSmshistoryModule
  ]
})
export class Matcha_AdminModule {
}
