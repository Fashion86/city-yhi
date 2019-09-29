import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ApiTokenService} from 'app/services/token.service';
import * as Constants from 'app/app.const';
import {MatSnackBar} from '@angular/material';
import {ApiAuthService} from 'app/services/auth.service';
import {Subject} from "rxjs/index";

@Injectable()
export class CohortService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  searchText: string;
  cohortTotalCount: number;
  numbers = [];
  pageNo = 1;
  numPerPage = 10;

  // For the cohort number list
  pageNoCohort = 1;
  numPerPageCohort = 10;

  myPhoneNumber = Constants.TWILIO_MY_NUMBER;

  onPageChanged: Subject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _token: ApiTokenService,
    private _auth: ApiAuthService,
    private _matSnackBar: MatSnackBar
  ) {
    this.numbers = [];
    this.onPageChanged = new Subject();
    this.onPageChanged.subscribe(pagedata => {
      this.pageNo = pagedata.pageNo;
      this.numPerPage = pagedata.numPerPage;
      this.getCohorts(this.pageNo, this.numPerPage, this.searchText);
    });
  }

  private jwt(): any {
    const tokenStr = this._token.get();
    if (tokenStr) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + tokenStr);
      return headers;
    } else {
      return '';
    }
  }

  /**
   * Get propertys
   *
   * @returns {Promise<any>}
   */

  getCohorts(pageNo = null, numPerPage = null, search = null ): Promise<any> {
    let params = new HttpParams();
    params = params.set('start', pageNo);
    params = params.set('numPerPage', numPerPage);
    params = params.set('search', search);

    return new Promise((resolve, reject) => {
        this._httpClient.get(Constants.API_URL + '/permanent/getCohorts', { params: params, headers: this.jwt()})
          .subscribe((response: any) => {
              this.cohortTotalCount = response['totalCount'];
              // this.numbers = response['numbers'];
              resolve(response);
            },
            error => {
              if (error.status == 301) {
                this._auth.logout();
              }
            });
      }
    );
  }

  getCohortSmsHistory(cohortName, loadmore): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(Constants.API_URL + '/permanent/getCohortSms?cohortName=' + cohortName + '&loadmore=' + loadmore, {headers: this.jwt()})
        .subscribe(
          (response: any) => {
            resolve(response);
          },
          error => {
            if (error.status === 301) {
              this._auth.logout();
            } else {
              resolve(error);
            }
          }
        );
    });
  }

  getCohortNumbers(cohortName, pageNo = null, numPerPage = null): Promise<any> {
    let params = new HttpParams();
    params = params.set('start', pageNo);
    params = params.set('numPerPage', numPerPage);
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(Constants.API_URL + '/permanent/getCohortNumbers?cohortName=' + cohortName, { params: params, headers: this.jwt()})
        .subscribe(
          (response: any) => {
            resolve(response);
          },
          error => {
            if (error.status === 301) {
              this._auth.logout();
            } else {
              resolve(error);
            }
          }
        );
    });
  }

  sendCohortSms(message): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(Constants.API_URL + '/permanent/cohortsmscreate', message, { headers: this.jwt()})
        .subscribe(
          response => {
            resolve(response);
          },
          error => {
            if (error.status == 401) {
              this._auth.logout();
            }
          }
        );
    });
  }
}
