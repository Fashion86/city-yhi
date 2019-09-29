import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ApiTokenService} from 'app/services/token.service';
import * as Constants from 'app/app.const';
import {MatSnackBar} from '@angular/material';
import {ApiAuthService} from 'app/services/auth.service';
import {Subject} from "rxjs/index";

@Injectable()
export class SmshistoryService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  searchText: string;
  numberTotalCount: number;
  numbers = [];
  pageNo = 1;
  numPerPage = 100;

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
      this.getNumbers(this.pageNo, this.numPerPage, this.searchText);
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

  getNumbers(pageNo = null, numPerPage = null, search = null ): Promise<any> {
    let params = new HttpParams();
    params = params.set('start', pageNo);
    params = params.set('numPerPage', numPerPage);
    params = params.set('search', search);

    return new Promise((resolve, reject) => {
        this._httpClient.get(Constants.API_URL + '/numbers', { params: params, headers: this.jwt()})
          .subscribe((response: any) => {
              this.numberTotalCount = response['totalCount'];
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

  getSmsHistoryByNumber(phoneNumber, dateSentBefore): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(Constants.API_URL + '/numbers/history?phoneNumber=' + phoneNumber + '&dateSentBefore=' + dateSentBefore, {headers: this.jwt()})
        .subscribe(
          (response: any) => {
            resolve(response);
          },
          error => {
            if (error.status == 301) {
              this._auth.logout();
            } else {
              resolve(error);
            }
          }
        );
    });
  }

  getUserInfoById(customerId): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(Constants.API_URL + '/numbers/getCustomerInfo?customerId=' + customerId, {headers: this.jwt()})
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

  sendSms(message): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(Constants.API_URL + '/numbers/smscreate', message, { headers: this.jwt()})
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

  saveSMSLog(smsLog): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(Constants.API_URL + '/numbers/smsLogSave', smsLog, { headers: this.jwt()})
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

  makeSupportSMSRead(phone): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(Constants.API_URL + '/numbers/setSupportRead', {phone: phone}, {headers: this.jwt()})
        .subscribe(
          response => {
            resolve(response);
          },
          error => {
            if (error.status === 301) {
              this._auth.logout();
            }
          }
        );
    });
  }
}
