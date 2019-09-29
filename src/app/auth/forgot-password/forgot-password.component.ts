import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuseConfigService} from '@fuse/services/config.service';
import {ApiAuthService} from 'app/services/auth.service';
import {SnotifyService} from 'ng-snotify';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm: FormGroup;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private auth: ApiAuthService,
        private notify: SnotifyService,
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    ngOnInit(): void {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit() {
        this.auth.sendPasswordResetLink(this.forgotPasswordForm.value).subscribe(
            data => {
                    this.handleResponse(data);
            },
            error => this.notify.error(error.error.error)
        );
    }

    handleResponse (res) {
        console.log(res);
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

}
