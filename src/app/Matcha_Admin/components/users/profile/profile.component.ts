import {Component, OnInit, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';

import {User} from 'app/models/user';
import {Location} from '@angular/common';
import {fuseAnimations} from '@fuse/animations';
import {FuseUtils} from '@fuse/utils';
import {UsersService} from '../users.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiTokenService} from '../../../../services/token.service';
import {ApiIamService} from '../../../../services/iam.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],

  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class ProfileComponent implements OnInit {

  user: User;
  profileForm: FormGroup;
  roles: any[];
  is_officer1: boolean;
  iam = null;

  constructor(
    private _formBuilder: FormBuilder,
    private _location: Location,
    private _matSnackBar: MatSnackBar,
    private _usersService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _tokenService: ApiTokenService,
    private _iamService: ApiIamService,
  ) {
    this.user = new User();
    this.profileForm = this.createProfileForm();
    this.activatedRoute.params.subscribe(params => {
      if (params['userid']) {
        this._usersService.getUsersById(params['userid']).then(res => {
          this.user = res['user'];

          // this.avatar_url = this.user.avatar;
          this.profileForm = this.createProfileForm();
        });
      }
    });
    this.iam = this._iamService.isRole;
    // this.profileForm
  }

  ngOnInit() {
    // this.curRole = this._tokenService.getUser().roleNames[0];
  }

  createProfileForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.user.id],
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone_number: [this.user.phone_number],
      smsbot_number: [this.user.smsbot_number],
      store_name: [this.user.store_name],
      store_link: [this.user.store_link],
    });
  }

  addUser(): void {
    const data = this.profileForm.getRawValue();
    data.handle = FuseUtils.handleize(data.name);
  
    this._usersService.createUser(data)
      .then(() => {
      
        // Show the success message
        this._matSnackBar.open('New user added', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
        this.router.navigate(['/admin/smshistory']);
      });
  }

  updateUser(): void {
    const data = this.profileForm.getRawValue();
    this._usersService.updateUser(data)
      .then(() => {
        // Show the success message
        this._matSnackBar.open('User updated', 'OK', {
          verticalPosition: 'top',
          duration: 2000
        });
        this.router.navigate(['/admin/smshistory']);
      });
  }
}
