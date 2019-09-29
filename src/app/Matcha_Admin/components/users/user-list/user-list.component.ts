import {Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {fuseAnimations} from '@fuse/animations';
import {FuseConfirmDialogComponent} from '@fuse/components/confirm-dialog/confirm-dialog.component';

import {UsersService} from '../users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;

  users: any;
  currentUser: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['avatar', 'username', 'email', 'buttons'];
  selectedUsers: any[];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {UsersService} _usersService
   * @param {MatDialog} _matDialog
   */

  constructor(
    private _usersService: UsersService,
    public _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar
  ) {
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
    this.dataSource = new FilesDataSource(this._usersService);

    this._usersService.onUsersChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(users => {
        this.users = users;

        this.checkboxes = {};
        users.map(user => {
          this.checkboxes[user.id] = false;
        });
      });

    this._usersService.onSelectedUsersChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedUsers => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedUsers.includes(id);
        }
        this.selectedUsers = selectedUsers;
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

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Edit user
   *
   * @param user
   */

  /**
   * Delete User
   */
  deleteUser(user): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._usersService.deleteUser(user).then(res => {
          this._matSnackBar.open('User deleted', 'OK', {
            verticalPosition: 'top',
            duration: 2000
          });
        }).catch(err => {
          this._matSnackBar.open('Failed User delete', 'OK', {
            verticalPosition: 'top',
            duration: 2000
          });
        });

      }
      this.confirmDialogRef = null;
    });

  }

  /**
   * On selected change
   *
   * @param userId
   */
  onSelectedChange(userId): void {
    this._usersService.toggleSelectedUser(userId);
  }

  /**
   * Toggle star
   *
   * @param userId
   */
  toggleStar(user): void {
    if (user.active_status === 1) {
      user.active_status = 0;
    }
    else {
      user.active_status = 1;
    }

    this._usersService.activeUser(user.id, user.active_status);

  }

}

export class FilesDataSource extends DataSource<any> {
  /**
   * Constructor
   *
   * @param {UsersService} _usersService
   */
  constructor(
    private _usersService: UsersService
  ) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._usersService.onUsersChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {
  }
}
