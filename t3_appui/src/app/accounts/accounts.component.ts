import { Router } from '@angular/router';
import { FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css',
              '../top-bar/top-bar.component.css',
              '../material/material.component.css']
})

export class AccountsComponent implements OnInit {
  formCreateAccount;
  msg = '';
  @ViewChild('firstName', {static: false}) firstName: ElementRef;
  toggleAccount;
  // accounts;
  faEdit = faEdit;
  formTitle;
  formButtonTxt;
  acctID = 0;

  showCount: 10;
  pageNumber: 1;
  totalCount: number;
  orderBy = '';
  orderOrder = 'ASC';
  searchVal = '';
  accounts;

  filter = new FormControl('');

  constructor(private formBuilder: FormBuilder, private api: ApiService, private router: Router) {
  }

  async ngOnInit() {
    await this.isAuthorized();
    this.showCount = 10;
    this.pageNumber = 1;
    this.resetFields();
    this.refreshSource();
  }

  resetFields() {
    this.formCreateAccount = this.formBuilder.group({
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        userLevel: 'user',
        gender: 'male',
    });
  }

  createAccount(data) {
    // const firstName = data.firstName;
    // const middleName = data.middleName;
    // const lastName = data.lastName;
    // const userLevel = data.userLevel;
    // const gender = data.genderMale ? data.genderMale : data.genderFemale;
      this.acctID > 0 ? data.id = this.acctID : data.id = 0;

      this.api.createAccount(data).toPromise()
          .then(
              res => {
                if (res.outBinds.id > 0) {
                  // tslint:disable-next-line: no-unused-expression
                  this.acctID === 0 ? this.resetFields() : false;
                  this.msgResponse(true);
                }
              },
              err => {
                if (err.status === 409) {
                  this.msgResponse(false);
                }
                console.log(err);
              }
            );
  }

  editAccount(id) {
    this.toggle(false);

    this.api.getAccountById(id).toPromise()
        .then(
            res => {
              this.formCreateAccount = this.formBuilder.group({
                  firstName: res[0].FIRST_NAME,
                  middleName: res[0].MIDDLE_NAME,
                  lastName: res[0].LAST_NAME,
                  username: res[0].USERNAME,
                  userLevel: res[0].USER_LEVEL.toLowerCase(),
                  gender: res[0].GENDER.toLowerCase(),
              });
              this.acctID = id;
            },
            err => {
              console.log(err);
            }
        );
  }

  msgResponse(status) {
    if (status) {
      this.acctID === 0 ? this.msg = 'Account successfully created.' : this.msg = 'Account successfully updated.';
    } else {
      this.acctID === 0 ? this.msg = 'Failed to create account.' : this.msg = 'Failed to update account.';
    }

    setTimeout(() => {
      this.msg = '';
    }, 3000);
  }

  toggle(isExist) {
    this.toggleAccount = !this.toggleAccount;
    this.resetFields();

    if (isExist) {
      this.formAttribute(false);
    } else {
      this.formAttribute(true);
      this.acctID = 0;
    }

  }

  async getAllAccounts(data) {
    await this.api.getAllAccounts(data).toPromise().then(
      res => {
        this.accounts = res.data;
        this.totalCount = res.counter;
      }
    );
  }

  refreshSource() {
    this.getAllAccounts(this.paginationData);
    // cons
  }

  formAttribute(isExist) {
      if (isExist) {
        this.formTitle = 'Update Account';
        this.formButtonTxt = 'Update';
      } else {
        this.formTitle = 'Create Account';
        this.formButtonTxt = 'Create';
      }

      setTimeout(() => {
        const fName = document.getElementById('firstName');
        fName.focus();
      }, 200);
  }

  resetPassword() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Reset the password to "welcome".',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((res) => {
      if (res.value) {
          const data = {
            id: this.acctID
          };

          this.api.resetPassword(data)
            .subscribe(
              response => {
                if (response === 'y') {
                  Swal.fire(
                    'Success',
                    'Password changed to "welcome".',
                    'success'
                  );
                }
              },
              err => {
                console.log(err);
              }
            );
      }
    });
  }

  get paginationData(): object {
    const data = {
      show_count: this.showCount,
      page_number: this.pageNumber,
      search_val: this.searchVal.trim(),
      order_by: this.orderBy,
      order_order: this.orderOrder
    };
    return data;
  }

  toggleOrder(orderBy: string) {
    (this.orderOrder === 'DESC' ? this.orderOrder = 'ASC' : this.orderOrder = 'DESC');
    this.orderBy = orderBy;
    this.refreshSource();
  }

  async isAuthorized() {
    const isAuthorized = await this.api.isAuth().toPromise();
    if (isAuthorized) {
      if (isAuthorized.USER_LEVEL.toUpperCase().trim() !== 'ADMIN') {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

}
