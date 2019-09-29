import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialog, MatIcon, PageEvent} from '@angular/material';
import {Subject} from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

import {fuseAnimations} from '@fuse/animations';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';

import { UsersService } from './users.service';
import {ApiTokenService} from "../../../services/token.service";
import { Router } from '@angular/router';


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class UsersComponent implements OnInit, OnDestroy {

    dialogRef: any;
    hasSelectedUsers: boolean;
    searchInput: string;
    totalCount: number;
    CountSubscription: Subscription;
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    pageEvent: PageEvent;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _usersService: UsersService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog,
        private _tokenService: ApiTokenService,
        private router: Router
    )
    {
        // Set the defaults
        this.pageSize = _usersService.numPerPage;
        // this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {

        this.totalCount = this._usersService.userTotalCount;
        // this.CountSubscription = this._usersService.getUserTotalCount().subscribe(count => {
        //     this.totalCount = count;
        // });
        this._usersService.searchText = "null";
        this._usersService.onUsersChanged
            .subscribe(users => {
                // this.users = users;
                this.totalCount = this._usersService.userTotalCount;
            });
        // this.searchInput.valueChanges
        //     .subscribe(searchText => {
        //         this._usersService.onSearchTextChanged.next(searchText);
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSetPage(event): void {
        this._usersService.onPageChanged.next({pageNo: event.pageIndex + 1, numPerPage: event.pageSize});
    }
    /**
     * New user
     */

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    searchUser(event) {
        this.searchInput = event.target.value;
        this._usersService.searchText = this.searchInput;
        console.log(event.key);
        if (event.key == "Enter") {
            this._usersService.getUsers(this._usersService.pageNo, this._usersService.numPerPage, this._usersService.searchText);
        }
    }

}
