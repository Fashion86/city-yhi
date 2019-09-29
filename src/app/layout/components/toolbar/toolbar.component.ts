import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {FuseConfigService} from '@fuse/services/config.service';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {FuseNavigationService} from '@fuse/components/navigation/navigation.service';


import {Router} from '@angular/router';

import {ApiAuthService} from 'app/services/auth.service';
import {ApiTokenService} from 'app/services/token.service';
import {User} from 'app/models/user';
import {ChangePasswordComponent} from '../../../Matcha_Admin/components/users/change-password/change-password.component';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  languages: any;
  navigation: any;
  selectedLanguage: any;
  userStatusOptions: any[];
  
  loggedIn: boolean;
  user: User;
  
  // Private
  private _unsubscribeAll: Subject<any>;
  
  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {TranslateService} _translateService
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _fuseSidebarService: FuseSidebarService,
    private _translateService: TranslateService,
    public router: Router,
    private auth: ApiAuthService,
    private token: ApiTokenService,
    private _fuseNavigationService: FuseNavigationService,
    public dialog: MatDialog
  ) {
    // Set the defaults
    this.userStatusOptions = [
      {
        'title': 'Online',
        'icon': 'icon-checkbox-marked-circle',
        'color': '#4CAF50'
      },
      {
        'title': 'Away',
        'icon': 'icon-clock',
        'color': '#FFC107'
      },
      {
        'title': 'Do not Disturb',
        'icon': 'icon-minus-circle',
        'color': '#F44336'
      },
      {
        'title': 'Invisible',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#BDBDBD'
      },
      {
        'title': 'Offline',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#616161'
      }
    ];
    
    this.languages = [
      {
        id: 'en',
        title: 'English',
        flag: 'us'
      },
      {
        id: 'tr',
        title: 'Turkish',
        flag: 'tr'
      }
    ];
    
    this.navigation = this._fuseNavigationService.getCurrentNavigation();
    
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.user = this.token.getUser();
  }
  
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the config changes
    this._fuseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((settings) => {
        this.horizontalNavbar = settings.layout.navbar.position === 'top';
        this.rightNavbar = settings.layout.navbar.position === 'right';
        this.hiddenNavbar = settings.layout.navbar.hidden === true;
      });
    
    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, {'id': this._translateService.currentLang});
    
    this.auth.authStatus.subscribe(value => this.loggedIn = value);
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
  openDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      data: {id: this.user.id}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
  }
  
  /**
   * Search
   *
   * @param value
   */
  search(value): void {
    // Do your search here...
    console.log(value);
  }
  
  /**
   * Set the language
   *
   * @param lang
   */
  setLanguage(lang): void {
    // Set the selected language for the toolbar
    this.selectedLanguage = lang;
    
    // Use the selected language for translations
    this._translateService.use(lang.id);
  }
  
  logout() {
    this.auth.logout();
  }
  
  my_profile() {
    this.router.navigate(['/admin/users/' + this.user.id + '/detail']);
  }
}
