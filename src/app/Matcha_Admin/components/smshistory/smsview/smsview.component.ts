import {Component, OnInit, Inject, ViewEncapsulation} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {fuseAnimations} from '@fuse/animations';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'smsview',
  templateUrl: './smsview.component.html',
  styleUrls: ['./smsview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SmsviewComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  reply(event): void {
    event.preventDefault();
  }
}
