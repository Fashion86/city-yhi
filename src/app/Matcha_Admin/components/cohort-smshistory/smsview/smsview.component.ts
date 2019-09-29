import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';

@Component({
  selector: 'smsview',
  templateUrl: './smsview.component.html',
  styleUrls: ['./smsview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SmsviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  reply(event): void {
    event.preventDefault();

    // if (!this.replyForm.form.value.message) {
    //   return;
    // }

  }
}
