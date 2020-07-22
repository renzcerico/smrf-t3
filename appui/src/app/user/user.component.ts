import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  id: number;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  lastName: string;
  firstName: string;
  middleName: string;
  username: string;
  password: string;
  userLevel: string;
  selectedDept: number;
  departments: any;
  response: any;
  msg = true;
  userID: number;

  constructor(public http: HttpClient,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.userID = this.data.id;
    this.getDepartments();
    this.getUserByID();
  }

  getDepartments() {
    const url = '/localapi/departments';
    this.http.get(url)
             .subscribe(
                 data => {
                     this.departments = data;
                 },
                 err => {
                     console.log(err);
                 }
              );
  }

  getUserByID() {
      if (this.userID) {
          const url = '/localapi/users/' + this.userID;
          this.http.get(url)
                  .subscribe(
                      data => {
                        this.lastName = data[0].LAST_NAME;
                        this.firstName = data[0].FIRST_NAME;
                        this.middleName = data[0].MIDDLE_NAME;
                        this.username = data[0].USERNAME;
                        this.userLevel = data[0].USER_LEVEL;
                        this.selectedDept = data[0].DEPARTMENT;
                      },
                      err => {
                          console.log(err);
                      }
                  );
      }
  }

  submitAccount(form) {
    if (this.userID) {
      // Update account
      this.update();
      return;
    }

    // Add account
    this.create(form);
  }

  create(form) {
      const json = {
          last_name: this.lastName,
          first_name: this.firstName,
          middle_name: this.middleName,
          username: this.username,
          user_level: this.userLevel,
          department: this.selectedDept
      };

      const url = '/localapi/user';
      this.http.post(url, json)
          .subscribe(
              res => {
                  this.response = res;
                  if (this.response.rowsAffected === 1) {
                      this.msg = !this.msg;
                      form.resetForm('');

                      setTimeout(() => {
                          this.msg = !this.msg;
                      }, 2000);
                  }
              },
              err => {
                  console.log(err);
              }
          );
  }

  update() {
      const json = {
          last_name: this.lastName,
          first_name: this.firstName,
          middle_name: this.middleName,
          username: this.username,
          user_level: this.userLevel,
          department: this.selectedDept,
          id: this.userID
      };

      const url = '/localapi/users/' + this.userID;
      this.http.post(url, json)
          .subscribe(
              res => {
                  this.response = res;
              },
              err => {
                  console.log(err);
              }
          );
  }
}
