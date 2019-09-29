import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {
    MatButtonModule, MatCheckboxModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatRadioModule, MatSelectModule, MatSnackBarModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {AuthGuard} from '../guard/auth.guard';
import {UsersService} from '../Matcha_Admin/components/users/users.service';
import {ManagerRegisterComponent} from './manager-register/manager-register.component';

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'manager-register',
        component: ManagerRegisterComponent,
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
    }
];


@NgModule({
    declarations: [LoginComponent, RegisterComponent, ForgotPasswordComponent, ResetPasswordComponent, ManagerRegisterComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSnackBarModule,

        FuseSharedModule,

        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        UsersService
    ]
})
export class AuthModule {
}
