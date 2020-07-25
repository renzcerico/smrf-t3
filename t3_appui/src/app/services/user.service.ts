import { HeaderService } from './header.service';
import { AccountFactory } from './../classes/account-factory';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';
import Account from '../classes/account';
import { HeaderFactory } from '../classes/header-factory';
import { ManpowerService } from './manpower.service';
import Header from '../classes/header';
import Manpower from '../classes/manpower';
// implement account factory
@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new Subject<any>();
  user$ = this.user.asObservable();
  isAuthorized = new Subject<boolean>();
  isAuthorized$ = this.isAuthorized.asObservable();
  userObj: Account;
  headerObj: Header;
  manpowers: Array<Manpower>;

  constructor(public api: ApiService,
              private accountFactory: AccountFactory,
              private headerService: HeaderService,
              private headerFactory: HeaderFactory,
              private manpowerService: ManpowerService) {
    this.user$.subscribe(res => {
      this.userObj = res;
    });
    this.isAuth();

    manpowerService.manpower$.subscribe(
      data => {
          this.manpowers = data;
      }
    );

    headerService.header$.subscribe(
        data => {
          if (Object.keys(data).length > 0) {
              this.headerObj = this.headerFactory.setHeader(data.header_obj);
              this.manpowerService.setManpower(data.manpower_collection);
              this.isAuthorized.next(this.isUserAuthorized());
            } else {
              this.headerObj = null;
              this.isAuthorized.next(false);
            }
        }
    );
  }

  setUser(user) {
    if (user) {
      const userObj: Account = this.accountFactory.setAccount(user);
      this.user.next(userObj);
    } else {
      this.user.next(user);
    }
  }

  logOut(): void {
    this.api.logout()
    .subscribe(
        res => {
          this.headerService.setHeaderObj({});
          this.setUser(null);
        },
        err => {
            console.log(err);
        }
    );
  }

  // getUser() {
  //   return this.user;
  // }

  isAuth() {
    this.api.isAuth()
    .subscribe(
        res => {
          this.setUser(res);
        },
        err => {
          console.log(err);
        }
    );
  }

  isUserAuthorized(): boolean {
    let isAuthorized = false;
    if (this.headerObj && this.userObj && this.manpowers) {
        const index = this.manpowers.findIndex(el => el.MANPOWER_ID === this.userObj.ID);
        if (index === 0 || index === 1) {
            isAuthorized = true;
        }
        if (this.userObj.USER_TYPE > 2) {
          isAuthorized = true;
        }
        if (this.headerObj.STATUS > this.userObj.USER_TYPE) {
          isAuthorized = false;
        }
        switch (this.headerObj.STATUS) {
            case 1:
              if (this.userObj.USER_TYPE >= 3) {
                isAuthorized = true;
              }
              isAuthorized = isAuthorized;
              break;
            case 2:
                if (this.headerObj.REVIEWED_BY === this.userObj.ID) {
                    isAuthorized = true;
                }
                break;
            case 3:
                if (this.headerObj.APPROVED_BY === this.userObj.ID) {
                    isAuthorized = true;
                }
                break;
            default:
                isAuthorized = false;
                break;
        }
    }
    return isAuthorized;
  }
}
