import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';
import * as Constants from '../app.const';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PusherService {
  pusher: any;
  channel: any;
  constructor(private http: HttpClient) {
    this.pusher = new Pusher(Constants.PUSHER_KEY, {
      cluster: Constants.PUSHER_CLUSTER,
      forceTLS: true
    });
    this.channel = this.pusher.subscribe('matcha-sms');
  }
}
