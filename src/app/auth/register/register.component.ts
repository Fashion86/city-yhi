import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/internal/operators';

import {Router} from '@angular/router';

import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';

import {ApiAuthService} from 'app/services/auth.service';
import {User} from 'app/models/user';
import {UsersService} from '../../Matcha_Admin/components/users/users.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  
  confirm: String;
  user: User;
  roles: any[] = [];
  
  avatar_url: any = null;
  avatarFile: File;
  errorMsg = null;
  
  // Private
  private _unsubscribeAll: Subject<any>;
  
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder,
    public router: Router,
    public auth: ApiAuthService,
    private _usersService: UsersService,
    private _matSnackBar: MatSnackBar,
  ) {
    this.user = new User();
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
    
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    
  }
  
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  
  /**
   * On init
   */
  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      avatar: [''],
      role: ['User', Validators.required],
      name: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
      agency_name: [''],
      street: ['', Validators.required],
      apt_unit: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip_code: ['', Validators.required],
    });
    
    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.registerForm.get('password').valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.registerForm.get('passwordConfirm').updateValueAndValidity();
      });
  }
  
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  
  onSubmit() {
    const data = this.registerForm.getRawValue();
    if (this.avatarFile) {
      this._usersService.uploadAvatarFile(this.avatarFile)
        .then((res) => {
          // Show the success message
          this._matSnackBar.open('New Avatar added', 'OK', {
            verticalPosition: 'top',
            duration: 10000,
            panelClass: ['green-snackbar']
          });
          data.avatar = res['avatar_url'];
        }).then(() => {
        this.auth.register(data).subscribe(
          data => {
            // Show the success message
            this._matSnackBar.open('New User added', 'OK', {
              verticalPosition: 'top',
              duration: 10000,
              panelClass: ['green-snackbar']
            });
            this.router.navigate(['/login']);
          },
          error => {
            console.log(error);
            if (error.error.name) {
              this.errorMsg = error.error.name[0];
            } else if (error.error.email) {
              this.errorMsg = error.error.email[0];
            } else {
              this.errorMsg = error.error['error'];
            }
          });
      });
    } else {
      this.auth.register(data).subscribe(
        data => {
          // Show the success message
          this._matSnackBar.open('New User added', 'OK', {
            verticalPosition: 'top',
            duration: 10000,
            panelClass: ['green-snackbar']
          });
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error.error);
          if (error.error.name) {
            this.errorMsg = error.error.name[0];
          } else if (error.error.email) {
            this.errorMsg = error.error.email[0];
          } else {
            this.errorMsg = error.error['error'];
          }
        });
    }
  }
  
  
  async selectAvatar(event, photo_num): Promise<void> {
    if (event.target.files.item(0)) {
      this.avatarFile = event.target.files.item(0);
      this.avatar_url = await this.getBase64(event.target.files.item(0));
    }
  }
  
  async getBase64(file): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
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
