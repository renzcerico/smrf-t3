import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';

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

  constructor(public http: HttpClient) { }

  ngOnInit() {
    this.getDepartments();
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
}
