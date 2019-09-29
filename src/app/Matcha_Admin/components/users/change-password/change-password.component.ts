import {Component, OnInit, Inject, ViewEncapsulation, OnDestroy} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import {AbstractControl, FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn} from '@angular/forms';
import {UsersService} from '../users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  password = '';
  passwordConfirm = '';
  
  constructor(
    private _usersService: UsersService,
    private _matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) {
    this.passwordForm = this.createForm();
  }

  ngOnInit() {
  }
  createForm(): FormGroup
  {
    return this._formBuilder.group({
      password            : [this.password, Validators.required],
      passwordConfirm     : [this.passwordConfirm, [Validators.required, confirmPasswordValidator]]
    });
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }
  updatePassword(): void {
    this._usersService.updateUserPassword(this.data.id, this.passwordForm.getRawValue().password)
      .then(() => {
        // Show the success message
        this._matSnackBar.open('User Password is Updated', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
        this.dialogRef.close();
      });
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

