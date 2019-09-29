import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule, Routes} from '@angular/router';
import {
  MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatGridListModule,
  MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule,
  MatSelectModule, MatSortModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule,
  MatSidenavModule,
} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';

import {FuseSharedModule} from '@fuse/shared.module';
import {FuseConfirmDialogModule, FuseSidebarModule} from '@fuse/components';
import {CohortService} from './cohort.service';

import {CohortSmshistoryComponent} from './cohort-smshistory.component';
import {AuthGuard} from '../../../guard/auth.guard';
import {SmsviewComponent} from './smsview/smsview.component';
import {ChatboxComponent} from './smsview/chatbox/chatbox.component';
import { CohortNumbersComponent } from './cohort-numbers/cohort-numbers.component';
const routes: Routes = [
  {
    path: '',
    component: CohortSmshistoryComponent,
    canActivate: [AuthGuard],
    data: {roles: ['admin', 'Admin', 'user', 'User']}
  },
  {
    path: ':cohort_name/detail',
    component: SmsviewComponent,
    canActivate: [AuthGuard],
    data: {roles: ['admin', 'Admin', 'user', 'User']}
  }
];

@NgModule({
  declarations: [
    CohortSmshistoryComponent,
    SmsviewComponent,
    ChatboxComponent,
    CohortNumbersComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    CommonModule
  ],
  providers: [
    CohortService
  ],
  entryComponents: []
})
export class CohortSmshistoryModule {
}
