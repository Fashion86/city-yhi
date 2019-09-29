import {AfterViewInit, Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SmshistoryService} from '../../smshistory.service';
import {NgForm} from '@angular/forms';
import {FusePerfectScrollbarDirective} from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import {fromEvent} from 'rxjs';
import {map} from 'rxjs/operators';
import * as moment from 'moment';
import {ApiTokenService} from 'app/services/token.service';
import {FuseProgressBarService} from '@fuse/components/progress-bar/progress-bar.service';
import {MatSnackBar} from '@angular/material';
import { PusherService} from 'app/services/pusher.service';
import {User} from 'app/models/user';

@Component({
  selector: 'sms-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [PusherService]
})
export class ChatboxComponent implements OnInit, AfterViewInit {

  // When used with a hyperlink
  // customerNumber: String;
  smsList: any[] = [];
  smsTempList: any[] = [];
  startDate = null;
  firstLoad: boolean;
  replyInput: any;

  user: User;
  customerNumber: '';
  // @Input() lastSMS: any;

  @ViewChild(FusePerfectScrollbarDirective)
  directiveScroll: FusePerfectScrollbarDirective;

  @ViewChildren('replyInput')
  replyInputField;

  @ViewChild('replyForm')
  replyForm: NgForm;

  isLoading = false;
  isEnd = 0;
  
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 0;
  direction = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _smshistoryService: SmshistoryService,
    private _matSnackBar: MatSnackBar,
    private token: ApiTokenService,
    private pusherService: PusherService
  ) {
    this.user = this.token.getUser();

    // When used with a hyperlink
    this.activatedRoute.params.subscribe(params => {
      if (params['phoneNumber']) {
          this.firstLoad = true;
        this.customerNumber = params['phoneNumber'];
        this.smsList = [];
        this.setSupportSMSRead(this.customerNumber)
        this.getSmsList(this.customerNumber);
      }
    });
  }

  ngOnInit(): void {

    this.pusherService.channel.bind('receiveSMS', data => {
      if (this.customerNumber === data.sms.from) {
        this.smsList.push(data.sms);
        this.readyToReply();
      }
    });
    this.pusherService.channel.bind('sendSMS', data => {
      if (this.customerNumber === data.sms.to) {
        this.smsList.push(data.sms);
        this.readyToReply();
      }
    });
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.replyInput = this.replyInputField.first.nativeElement;
    this.readyToReply();
  }
  
  setSupportSMSRead(phone): void {
    this._smshistoryService.makeSupportSMSRead(phone).then(
      res => {
        console.log('setSupportSMSRead res', res);
      }
    ).catch( e => {
      console.log(e);
    });
  }

  onScrollDown (ev) {
    // console.log('scrolled down!!', ev);
    this.direction = 'down'
  }
  
  onUp(ev) {
    // console.log('scrolled up!', ev);
    if (this.isEnd > 0 && this.smsList[0]) {
      this.startDate = moment(this.smsList[0].date).utc().subtract(1, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSS');
      this.getSmsList(this.customerNumber, this.startDate + 'Z');
    }
    this.direction = 'up';
  }
  
  getSmsList(phoneNumber, dateSentBefore = null): void {
    this.isLoading = true;
    this._smshistoryService.getSmsHistoryByNumber(phoneNumber, dateSentBefore).then(res => {
      this.smsTempList = res.smsList;
      this.isEnd = this.smsTempList.length;
      this.smsList = [...this.smsTempList, ...this.smsList];
      
      if (this.firstLoad) {
        this.readyToReply();
        this.firstLoad = false;
      }
      this.isLoading = false;
    }).catch(err => {
      this._matSnackBar.open('Failed to load SMS Feed', 'OK', {
        verticalPosition: 'top',
        duration: 2000
      });
      this.isLoading = false;
    });
  }

  /**
   * Check if the given message is the first message of a group
   *
   * @param message
   * @param i
   * @returns {boolean}
   */
  isFirstMessageOfGroup(message, i): boolean {
    return (i === 0 || this.smsList[i - 1] && this.smsList[i - 1].from !== message.from);
  }

  /**
   * Check if the given message is the last message of a group
   *
   * @param message
   * @param i
   * @returns {boolean}
   */
  isLastMessageOfGroup(message, i): boolean {
    return (i === this.smsList.length - 1 || this.smsList[i + 1] && this.smsList[i + 1].from !== message.from);
  }

  /**
   * Decide whether to show or not the contact's avatar in the message row
   *
   * @param message
   * @param i
   * @returns {boolean}
   */
  shouldShowContactAvatar(message, i): boolean {
    return (
      message.from === this.customerNumber &&
      ((this.smsList[i + 1] && this.smsList[i + 1].from !== this.customerNumber) || !this.smsList[i + 1])
    );
  }

  /**
   * Ready to reply
   */
  readyToReply(): void {
    setTimeout(() => {
      this.focusReplyInput();
      this.scrollToBottom();
    });
    console.log('eeeeeeeeeeeeeeeeeeee');
  }

  /**
   * Focus to the reply input
   */
  focusReplyInput(): void {
    setTimeout(() => {
      this.replyInput.focus();
    });
  }

  /**
   * Scroll to the bottom
   *
   * @param {number} speed
   */
  scrollToBottom(speed?: number): void {
    speed = speed || 400;
    if (this.directiveScroll) {
      this.directiveScroll.update();

      setTimeout(() => {
        this.directiveScroll.scrollToBottom(0, speed);
      });
    }
  }

  reply(event): void {
    event.preventDefault();
    if (!this.replyForm.form.value.message) {
      return;
    }

    // Message
    let message = {
      message: {
        from: this._smshistoryService.myPhoneNumber,
        to: this.customerNumber,
        body: this.replyForm.form.value.message
      }
    };

    // Add the message to the chat
    this.isLoading = true;
    this._smshistoryService.sendSms(message).then(res => {
      let message = res.message;
      message.dashboardUser = this.user.email;
      this.smsList.push(message);
      this.isLoading = false;

      const smsLogObj = {
        smsLog: {
          to: res.message.to,
          from: res.message.from,
          dashboard_user: this.user.email,
          status: res.message.status,
          twilio_sid: res.message.sid,
          sms_body: res.message.body
        }
      }

      this._smshistoryService.saveSMSLog(smsLogObj).then(res => {
      }).catch(err => {
        this._matSnackBar.open('Failed to Save SMS log', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
      });

    }).catch(err => {
      this._matSnackBar.open('Failed to Send SMS', 'OK', {
        verticalPosition: 'top',
        duration: 2000
      });
      this.isLoading = false;
    });

    // Reset the reply form
    this.replyForm.reset();
    this.readyToReply();
  }
}
