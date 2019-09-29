import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MatDialog, MatSnackBar} from '@angular/material';

import {CohortService} from '../cohort.service';

@Component({
  selector: 'app-cohort-numbers',
  templateUrl: './cohort-numbers.component.html',
  styleUrls: ['./cohort-numbers.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class CohortNumbersComponent implements OnInit {
  
  cohortName = ''
  numberList: any[] = [];
  numberTempList: any[] = [];
  isLoading = false;
  isEnd = 0;

  totalCount: number;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  displayedColumns = ['phone', 'note', 'created_at'];
  dataSource = new MatTableDataSource(this.numberList);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _cohortService: CohortService,
    private _matSnackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.cohortName = params['cohort_name']
      if (params['cohort_name']) {
        this.getNumbersList(params['cohort_name']);
      }
    });
  }
  
  onSetPage(event): void {
    this._cohortService.pageNoCohort = event.pageIndex + 1;
    this._cohortService.numPerPageCohort = event.pageSize;
    this.paginator.pageIndex = event.pageIndex;
    this.paginator.pageSize = event.pageSize;
    this.getNumbersList(this.cohortName);
  }

  getNumbersList(cohortName): void {
    this.isLoading = true;
    this._cohortService.getCohortNumbers(cohortName, this._cohortService.pageNoCohort, this._cohortService.numPerPageCohort).then(res => {
      console.log('getCohortNumbers result', res);
      
      this.numberTempList = res.numberList;
      this.isEnd = this.numberTempList.length;
      // this.numberList = [...this.numberTempList, ...this.numberList];
      this.numberList = res.numberList;
      this.dataSource.data = this.numberList;
      this.totalCount = res.totalCount;
      
      this.isLoading = false;
    }).catch(err => {
      this._matSnackBar.open('Failed to load the cohort numbers', 'OK', {
        verticalPosition: 'top',
        duration: 2000
      });
      this.isLoading = false;
    });
  }

}
