import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule, Routes} from '@angular/router';
import {
  MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatMenuModule, MatRippleModule, MatTableModule, MatToolbarModule,
  MatSelectModule, MatSortModule, MatAutocompleteModule, MatTabsModule, MatProgressSpinnerModule,
  MatSidenavModule
} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';

import {FuseSharedModule} from '@fuse/shared.module';
import {FuseConfirmDialogModule, FuseSidebarModule} from '@fuse/components';
import {SmshistoryService} from './smshistory.service';
import {PhonelistService} from './smsview/phonelist/phonelist.service';

import {SmshistoryComponent} from './smshistory.component';
import {AuthGuard} from '../../../guard/auth.guard';
import {SmsviewComponent} from './smsview/smsview.component';
import {UserComponent} from './smsview/user/user.component';
import {ChatboxComponent} from './smsview/chatbox/chatbox.component';
import {PhonelistComponent} from './smsview/phonelist/phonelist.component';
import {OrderDetailComponent} from './smsview/user/order-detail/order-detail.component';
import {DateAgoPipe} from '../../../pipes/date-ago.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Routes = [
  {
    path: '',
    component: SmshistoryComponent,
    canActivate: [AuthGuard],
    data: {roles: ['admin', 'Admin', 'user', 'User']}
  },
  {
    path: ':phoneNumber/detail',
    component: SmsviewComponent,
    canActivate: [AuthGuard],
    data: {roles: ['admin', 'Admin', 'user', 'User']}
  }
];

@NgModule({
  declarations: [
    SmshistoryComponent,
    SmsviewComponent,
    UserComponent,
    ChatboxComponent,
    PhonelistComponent,
    OrderDetailComponent,    DateAgoPipe
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
    MatAutocompleteModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSidenavModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    CommonModule,
    InfiniteScrollModule
  ],
  providers: [
    SmshistoryService,
    PhonelistService,
    DateAgoPipe
  ],
  entryComponents: [
    OrderDetailComponent
  ]
})
export class SmshistoryModule {
}
