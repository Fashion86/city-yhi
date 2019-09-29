import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import {fuseAnimations} from '../../../../@fuse/animations';
import {MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MatDialog, MatSnackBar} from '@angular/material';
import {CohortService} from './cohort.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseConfirmDialogComponent} from '@fuse/components/confirm-dialog/confirm-dialog.component';
import {FormBuilder} from '@angular/forms';
import {Subscription} from "rxjs/Subscription";

import {switchMap, debounceTime, takeUntil} from 'rxjs/operators';
import {ApiIamService} from "../../../services/iam.service";

@Component({
  selector: 'app-cohort-smshistory',
  templateUrl: './cohort-smshistory.component.html',
  styleUrls: ['./cohort-smshistory.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CohortSmshistoryComponent implements OnInit {
  cohorts: any[] = [];
  displayedColumns = ['cohorts', 'population', 'lastsmsdate', 'lastsms'];
  dataSource = new MatTableDataSource(this.cohorts);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dialogRef: any;

  iam = null;

  isLoading = false;

  totalCount: number;
  pageSize = 100;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private _fuseSidebarService: FuseSidebarService,
    private _cohortService: CohortService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private fb: FormBuilder,
    private _iamService: ApiIamService,
  ) {
    this.pageSize = this._cohortService.numPerPage;
    this.iam = this._iamService.isRole;
  }

  ngOnInit(): void {
    this.totalCount = this._cohortService.cohortTotalCount;
    this.getCohortsList();
  }

  onSetPage(event): void {
    this._cohortService.pageNo = event.pageIndex + 1;
    this._cohortService.numPerPage = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.getCohortsList();
  }

  getCohortsList( searchText = null ): void {
    this.isLoading = true;
    this._cohortService.getCohorts( this._cohortService.pageNo, this._cohortService.numPerPage, searchText).then(
      res => {
        this.cohorts = res['cohorts'];
        this.totalCount = res['totalCount']
        this.dataSource.data = this.cohorts;

        this.isLoading = false;
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
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
}
