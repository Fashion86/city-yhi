import {Component, OnInit, Inject, ViewEncapsulation, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {AbstractControl, FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn} from '@angular/forms';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailComponent implements OnInit {
  order: any;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.order = this.data.order;
  }

  ngOnInit() {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}


/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  
  if (!control.parent || !control) {
    return null;
  }
  
  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');
  
  if (!password || !passwordConfirm) {
    return null;
  }
  
  if (passwordConfirm.value === '') {
    return null;
  }
  
  if (password.value === passwordConfirm.value) {
    return null;
  }
  
  return {'passwordsNotMatching': true};
};

