import { AccountFactory } from './../classes/account-factory';
import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';
import Account from '../classes/account';
// implement account factory
@Injectable({
  providedIn: 'root'
})
export class UserService {
  user = new Subject<any>();
  user$ = this.user.asObservable();

  constructor(public api: ApiService,
              private accountFactory: AccountFactory) {
      this.isAuth();
  }

  setUser(user) {
    if (user) {
      const userObj: Account = this.accountFactory.setAccount(user);
      this.user.next(userObj);
    } else {
      this.user.next(user);
    }
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
}
