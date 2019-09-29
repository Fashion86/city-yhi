import {Component, OnInit, OnDestroy, ViewEncapsulation, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';

import {ActivatedRoute, Router} from '@angular/router';
import {SmshistoryService} from '../../smshistory.service';
import 'rxjs/add/operator/filter';
import {OrderDetailComponent} from './order-detail/order-detail.component';
import {MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'sms-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class UserComponent implements OnInit {
  user: any;
  orders: any[] = [];
  userNumber: '';
  customerId: '';
  dataSource = new MatTableDataSource(this.orders);
  displayedColumns = ['orderid', 'orderdate', 'buttons'];
  expandedOrder: PeriodicOrder | null;
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _smshistoryService: SmshistoryService,
    public dialog: MatDialog
  ) {
    // When used with a hyperlink
    this.customerId = '';
    this.activatedRoute.params.subscribe(params => {
      if (params['phoneNumber']) {
        this.userNumber = params['phoneNumber'];
      }
    });
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.customerId && params.customerId !== '') {
        this.customerId = params.customerId;
        this._smshistoryService.getUserInfoById(this.customerId).then(res => {
          this.user = res.customerInfo;
          this.orders = this.user.orders;
          this.dataSource.data = this.orders;
        });
      } else {
        this.user = {};
      }
    });
  }
  ngOnInit(): void {}
  goToShopifyOrders(): void {
    window.open('https://accounts.shopify.com/store-login?redirect=orders', "_blank");
  }
  showCohort(): string {
    if (this.user && this.user.orders) {
      return 'Purchased';
    } else {
      return 'Marketing';
    }
  }
}


export interface PeriodicOrder {
  orderNumber: string;
  orderDate: string;
  products: any[];
  cost: string;
  currency: string;
}