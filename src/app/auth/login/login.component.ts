import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Router} from '@angular/router';

import {FuseConfigService} from '@fuse/services/config.service';
import {fuseAnimations} from '@fuse/animations';

import {ApiAuthService} from 'app/services/auth.service';
import {ApiTokenService} from 'app/services/token.service';
import {FuseNavigationService} from '@fuse/components/navigation/navigation.service';
import {adminNavigation} from 'app/navigation/navigation';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMsg = null;
  errorStatus: any;

  constructor(
    private _fuseConfigService: FuseConfigService,
    private _fuseNavigationService: FuseNavigationService,
    private _formBuilder: FormBuilder,
    public router: Router,
    public auth: ApiAuthService,
    public token: ApiTokenService
  ) {
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
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', Validators.required]
    });
    this.loginForm.valueChanges.subscribe((data) => {
      this.errorMsg = null;
      this.errorStatus = null;
    });
  }

  onSubmit() {
    const params = {
      data: this.loginForm.value
    };
    this.auth.authenticate(params).subscribe(
      data => this.handleResponse(data),
      error => {
        console.log('error', error);
        if (error.status == 409) {
          this.errorStatus = 409;
          // this.errorMsg = 'Account is not activated, please contact'+'<a href="https://registermygear.freshdesk.com/support/home" target="_blank">Support</a>'
        } else {
          this.errorStatus = error.status;
          this.errorMsg = error.failed;
        }
      });
  }

  handleResponse(data) {
    this.token.handle(data);
    this.auth.changeAuthStatus(true);

    this._fuseNavigationService.initregister();
    this._fuseNavigationService.register('main', adminNavigation);
    this._fuseNavigationService.setCurrentNavigation('main');
    this.router.navigate(['/admin/smshistory']);
  }
}
