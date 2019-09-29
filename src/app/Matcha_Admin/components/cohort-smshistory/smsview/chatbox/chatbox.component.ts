import {AfterViewInit, Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {FusePerfectScrollbarDirective} from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import {fromEvent} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {CohortService} from '../../cohort.service';

@Component({
  selector: 'sms-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatboxComponent implements OnInit, AfterViewInit {

  cohortName: String;
  smsList: any[] = [];
  smsTempList: any[] = [];
  loadmore = 0;
  firstLoad: boolean;
  replyInput: any;
  myPhoneNumber: any;

  @ViewChild(FusePerfectScrollbarDirective)
  directiveScroll: FusePerfectScrollbarDirective;

  @ViewChildren('replyInput')
  replyInputField;

  @ViewChild('replyForm')
  replyForm: NgForm;

  isLoading = false;
  isEnd = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _cohortService: CohortService,
    private _matSnackBar: MatSnackBar
  ) {
    this.firstLoad = true;
    this.myPhoneNumber = this._cohortService.myPhoneNumber;
  }

  ngOnInit(): void {
    // this.readyToReply();
    this.firstLoad = true;

    // this.pusherService.channel.bind('receiveSMS', data => {
    //   if (this.customerNumber === data.sms.from) {
    //     this.smsList.push(data.sms);
    //     this.readyToReply();
    //   }
    // });

    this.activatedRoute.params.subscribe(params => {
      if (params['cohort_name']) {
        this.cohortName = params['cohort_name'];
        this.getSmsList(params['cohort_name']);
      }
    });
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.replyInput = this.replyInputField.first.nativeElement;
    // this.readyToReply();

    const content = document.querySelector('#chat-content');
    const scroll$ = fromEvent(content, 'scroll').pipe(map(() => content));

    scroll$.subscribe(element => {
      // do whatever
      if (!this.firstLoad && this.isEnd > 0 && this.directiveScroll.ps.scrollbarYTop === 0) {
        this.getSmsList(this.cohortName, this.loadmore);
      }
    });
  }

  getSmsList(cohortName, loadmore = 0): void {
    this.isLoading = true;
    this._cohortService.getCohortSmsHistory(cohortName, loadmore).then(res => {
      this.smsTempList = res.smsList;
      this.isEnd = this.smsTempList.length;
      this.smsList = [...this.smsTempList, ...this.smsList];
      this.loadmore ++;
      // this.smsList = this.smsTempList.concat(this.smsList);
      if (this.firstLoad) {
        this.readyToReply();
      }
      this.isLoading = false;
    }).catch(err => {
      this._matSnackBar.open('Failed to load SMS feed', 'OK', {
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
      message.to === this.myPhoneNumber &&
      ((this.smsList[i + 1] && this.smsList[i + 1].to !== this.myPhoneNumber) || !this.smsList[i + 1])
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
      this.firstLoad = false;
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
        from: this.myPhoneNumber,
        to: this.cohortName,
        body: this.replyForm.form.value.message
      }
    };

    // Add the message to the chat
    this.isLoading = true;
    this._cohortService.sendCohortSms(message).then(res => {
      message = res.message;
      this.smsList.push(message);
      this.isLoading = false;
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
