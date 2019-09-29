import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogRef, MatPaginator, MatSort, MatSnackBar, MatTableDataSource} from '@angular/material';
import {FormBuilder} from '@angular/forms';
import {PhonelistService} from './phonelist.service';
import {PusherService} from 'app/services/pusher.service';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {fuseAnimations} from '@fuse/animations';
import {ActivatedRoute} from '@angular/router';
import * as moment from 'moment';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-phonelist',
  templateUrl: './phonelist.component.html',
  styleUrls: ['./phonelist.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class PhonelistComponent implements OnInit {
  numbers: any[] = [];
  displayedColumns = ['phone'];
  dataSource = new MatTableDataSource(this.numbers);
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dialogRef: any;
  searchInput: null;
  isLoading = false;
  
  totalCount: number;
  pageSize = 100;
  pageIndex: number=0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  
  selectedNumber = '';
  yesterdayDate = new Date();
  
  constructor(
    private _fuseSidebarService: FuseSidebarService,
    private _phonelistService: PhonelistService,
    private _matSnackBar: MatSnackBar,
    private fb: FormBuilder,
    private pusherService: PusherService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.pageSize = this._phonelistService.numPerPage;
    this.yesterdayDate.setDate(this.yesterdayDate.getDate() - 1);

    this.activatedRoute.params.subscribe(params => {
      if (params['phoneNumber']) {
        this.selectedNumber = params['phoneNumber'];
      }
    });
  }
  
  compareDate (date1, date2): boolean {
    let beforeDate = new Date(date1);
    let smsDate = new Date(date2);
    if (beforeDate.getTime()-smsDate.getTime() < 0) {
      return true;
    } else {
      return false;
    }
  }
  
  ngOnInit(): void {
    this.totalCount = this._phonelistService.numberTotalCount;
    this.getPhoneNumberList(this.searchInput);
    
    this.pusherService.channel.bind('receiveSMS', data => {
      console.log('receiveSMS data', data);
      
      const smsNo = this.receiveSMSfromBot(data.number);
      
      this.numbers[smsNo] = data.number;
      const a = this.numbers.splice( smsNo, 1 );   // removes the item
      a[0].last_sms_date = data.sms.date;
      a[0].created_at = data.sms.date;
      a[0].updated_at = data.sms.date;
      a[0].text = data.sms.body;
      this.numbers.unshift(a[0]);
      this.dataSource.data = this.numbers;
    });
  }
  
  receiveSMSfromBot (newSMS): any {
    let smsNo = -1;
    for (let i = 0; i < this.numbers.length; i ++) {
      if (this.numbers[i].phone === newSMS.phone) {
        smsNo = i;         // adds it back to the beginning
        break;
      }
    }
    return smsNo;
  }
  onScrollDown (ev) {
    console.log('scrolled down!!', ev);
    if (this.numbers.length < this.totalCount) {
      this.onSetPage();
    }
    this.direction = 'down'
  }
  
  onUp(ev) {
    console.log('scrolled up!', ev);
    // const start = this.sum;
    // this.sum += 20;
    // this.prependItems(start, this.sum);
    
    this.direction = 'up';
  }
  onSetPage(): void {
    this._phonelistService.pageNo = this.pageIndex + 1;
    this.getPhoneNumberList(this.searchInput);
  }
  
  searchNumber(event): void {
    this.searchInput = event.target.value;
    this._phonelistService.searchText = this.searchInput;
    if (event.key == "Enter") {
      this.numbers = [];
      this.getPhoneNumberList(this.searchInput);
    }
  }
  
  getPhoneNumberList(search=null): void {
    this.isLoading = true;
    this._phonelistService.getPhoneNumbers( this._phonelistService.pageNo, this._phonelistService.numPerPage, search).then(
      res => {
        this.numbers = this.numbers ? [...this.numbers, ...res['numbers']] : res['numbers'];
        this.totalCount = res['totalCount'];
        this.dataSource.data = this.numbers;
        
        this.isLoading = false;
      }
    ).catch( e => {
      console.log(e);
    });
  }
}
