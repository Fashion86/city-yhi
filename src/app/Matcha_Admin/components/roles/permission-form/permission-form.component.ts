import {Component, OnInit, Inject, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {Permission} from 'app/models/permission';
import {RoleService} from '../role.service';
import {takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-permission-form',
    templateUrl: './permission-form.component.html',
    styleUrls: ['./permission-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PermissionFormComponent {

    action: string;
    permission: Permission;
    permissionForm: FormGroup;
    dialogTitle: string;
    roles: any[];

    /**
     * Constructor
     *
     * @param {MatDialogRef<PermissionFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */

    constructor(
        public matDialogRef: MatDialogRef<PermissionFormComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder, private _roleService: RoleService
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Permission';
            this.permission = _data.permission;
        }
        else
        {
            this.dialogTitle = 'New Permission';
            this.permission = new Permission();
        }

        this.permissionForm = this._formBuilder.group({
            name        : [this.permission.name, Validators.required],
        });

        this.permissionForm.valueChanges.subscribe( event => {
            this.permission.name = event.name;
        });
    }
}
