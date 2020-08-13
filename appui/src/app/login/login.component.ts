import { Component, OnInit } from '@angular/core';
import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from './../user.service';
import { isNull } from 'util';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUsername;
  loginPassword;
  apiResponse;
  response;
  invalidLogin = true;
  error = 0;
    socket;
  constructor(private http: HttpClient,
              public router: Router,
              private userService: UserService) {
        this.testObservable.subscribe();
              }

  testObservable = new Observable<any>((observer) => {
    this.socket.on('receive_test', (data) => {
      alert(data);
    });
  });

  ngOnInit(): void {
    this.currentUser();
    this.socket = io('/smrf');
  }

  requiredFields() {
    const username = this.loginUsername ? this.loginUsername.trim() : '';
    const password = this.loginPassword ? this.loginPassword.trim() : '';

    const required = [username, password];

    required.forEach((value) => {
        if (!value) {
            this.error = 1;
        }
    });
  }

  login() {
    const json = {
        username: this.loginUsername,
        password: this.loginPassword
    };

    // this.userService.progressMode = 'indeterminate';

    // this.requiredFields();

    // if (this.error > 0) {
    //   this.userService.progressMode = 'determinate';
    //   return;
    // }

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json'
    //   })
    // };
    const options = { headers: new HttpHeaders().set('Content-Type', 'application/json'), withCredentials: true };

    this.http.post('/localapi/login', json, options)
        .subscribe(
          res => {
            this.apiResponse = res;

            if (this.apiResponse != null) {
              const name = (this.apiResponse[0].FIRST_NAME || '') +
              ' ' + (this.apiResponse[0].MIDDLE_NAME || '') +
              ' ' + (this.apiResponse[0].LAST_NAME || '');
              const userLevel = this.apiResponse[0].USER_LEVEL;
              const id = this.apiResponse[0].ID;
              const dept = this.apiResponse[0].DEPARTMENT;

              this.userService.userLoggedIn = true;
              this.userService.userLevel = userLevel;
              this.userService.user = {
                id,
                name,
                user_level: userLevel,
                department: dept
              };

              // this.router.navigate(['/request']);
              this.redirectAuth();
              this.userService.progressMode = 'determinate';
            } else {
              this.invalidLogin = false;

              setTimeout(() => {
                this.invalidLogin = true;
              }, 3000);
              this.userService.progressMode = 'determinate';
            }

          },
          err => {
            this.apiResponse = err;
            console.log(err);
          }
        );
  }

  redirectAuth() {
    // const auth = ['head', 'requestor', 'admin'];
    const auth = ['requestor', 'admin'];
    const login = this.router.url;

    if (login === '/login') {
      if (auth.includes(this.userService.userLevel)) {
        this.router.navigate(['/request']);
      } else {
        if (this.userService.userLevel === 'head' || this.userService.userLevel === 'supervisor') {
          this.router.navigate(['/manage-request']);
        } else {
          this.router.navigate(['/job']);
          this.userService.jobOrder = 1;
        }
      }
    }
  }

  async currentUser() {
    const url = '/localapi/session';

    await this.http.get(url)
              .subscribe(
                res => {
                  this.response = res;

                  if (this.response.length > 0) {

                    const name = this.response[0].FIRST_NAME + ' ' + this.response[0].MIDDLE_NAME + ' ' + this.response[0].LAST_NAME;
                    const userLevel = this.response[0].USER_LEVEL;

                    this.userService.userLoggedIn = true;
                    this.userService.userLevel = userLevel;

                    this.userService.user = {
                      id: this.response[0].ID,
                      name,
                      user_level: userLevel,
                      department: this.response[0].DEPARTMENT
                    };

                    this.redirectAuth();
                  }

                },
                err => {
                  console.log(err);
                }
              );
  }
  test() {
      console.log('test');
      this.socket.emit('test', 'renz burat');
  }

}
