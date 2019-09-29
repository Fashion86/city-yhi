import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import {fuseAnimations} from '../../../../@fuse/animations';
import {MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MatDialog, MatSnackBar} from '@angular/material';
import {SmshistoryService} from './smshistory.service';
import {FuseConfirmDialogComponent} from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {FormBuilder} from '@angular/forms';
import {Subscription} from "rxjs/Subscription";

import {switchMap, debounceTime, takeUntil} from 'rxjs/operators';
import {ApiIamService} from "../../../services/iam.service";
import {PusherService} from 'app/services/pusher.service';
import {SmsviewComponent} from './smsview/smsview.component';


@Component({
  selector: 'app-smshistory',
  templateUrl: './smshistory.component.html',
  styleUrls: ['./smshistory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SmshistoryComponent implements OnInit {
  numbers: any[] = [];
  selectedUserId: any;
  displayedColumns = ['phone', 'time', 'cohort', 'ltv', 'product'];
  dataSource = new MatTableDataSource(this.numbers);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dialogRef: any;
  lastSMS: any;
  searchInput: string;

  iam = null;

  isLoading = false;

  totalCount: number;
  pageSize = 100;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private _fuseSidebarService: FuseSidebarService,
    private _smshistoryService: SmshistoryService,
    private _matSnackBar: MatSnackBar,
    private fb: FormBuilder,
    private _iamService: ApiIamService,
    private pusherService: PusherService
  ) {
    this.pageSize = this._smshistoryService.numPerPage;
    this.iam = this._iamService.isRole;
  }

  ngOnInit(): void {
    this.totalCount = this._smshistoryService.numberTotalCount;
    this.searchInput = null;
    this.getNumberList(this.searchInput);

    this.pusherService.channel.bind('receiveSMS', data => {
      console.log('receiveSMS data', data);
      
      const smsNo = this.receiveSMSfromBot(data.number);

      this.numbers[smsNo] = data.number;
      let a = this.numbers.splice( smsNo, 1 );   // removes the item
      a[0].last_sms_date = data.sms.date;
      a[0].created_at = data.sms.date;
      a[0].updated_at = data.sms.date;
      a[0].text = data.sms.body;
      this.lastSMS = data.sms;
      this.numbers.unshift(a[0]);
      this.dataSource.data = this.numbers;
    });
    // this.pusherService.channel.bind('sendSMS', data => {
    //
    // });
  }

  receiveSMSfromBot (newSMS): number {
    let smsNo = -1;
    for (let i = 0; i < this.numbers.length; i ++) {
      if (this.numbers[i].phone === newSMS.phone) {
        smsNo = i;         // adds it back to the beginning
        break;
      }
    }
    return smsNo;
  }

  onSetPage(event): void {
    this._smshistoryService.pageNo = event.pageIndex + 1;
    this._smshistoryService.numPerPage = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.getNumberList(this.searchInput);
  }

  getNumberList(searchText=null): void {
    this.isLoading = true;
    this._smshistoryService.getNumbers( this._smshistoryService.pageNo, this._smshistoryService.numPerPage, searchText).then(
      res => {
        this.numbers = res['numbers'];
        this.totalCount = res['totalCount']
        this.dataSource.data = this.numbers;

        this.isLoading = false;
      }
    ).catch( e => {
      console.log(e);
    });
  }

  toggleStar(number): void
  {
    if ( number.safe_status === 1 )
    {
      number.safe_status = 0;
    } else
    {
      number.safe_status = 1;
    }
    }

  toggleSidebar(name): void
  {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  searchNumber(event) {
    this.searchInput = event.target.value;
    this._smshistoryService.searchText = this.searchInput;
    console.log(event.key);
    if (event.key == "Enter") {
      this.getNumberList(this.searchInput);
    }
  }

}
