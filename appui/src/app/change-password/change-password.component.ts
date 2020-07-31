import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  currentPassword;
  newPassword;
  confirmPassword;
  error = 0;
  errorCurrentPassword = false;
  apiResponse;
  success = false;

  constructor(public http: HttpClient,
              public user: UserService,
              public dialogRef: MatDialogRef<ChangePasswordComponent>) { }

  ngOnInit(): void {
  }

  requiredFields() {
      this.error = 0;
      const data = [this.currentPassword, this.newPassword, this.confirmPassword];

      data.forEach(value => {
          if (!value) {
              this.error = 1;
          }
      });
  }

  async verifyCurrentPassword() {
      const data = { id: this.user.user.id, password: this.currentPassword };

      await this.http.post('/localapi/verify-password', data).toPromise()
                .then(
                    res => {
                        this.apiResponse = res;

                        if (this.apiResponse[0].COUNT === 0) {
                            this.error = 1;
                            this.errorCurrentPassword = true;
                        } else  {
                            this.error = 0;
                            this.errorCurrentPassword = false;
                        }
                    },
                    err => {
                        console.log(err);
                    }
                );
  }

  async submitChangePassword() {
      this.requiredFields();
      await this.verifyCurrentPassword();

      if (this.error === 0) {
        const data = {
            userID: this.user.user.id,
            password: this.newPassword
        };

        this.http.post('/localapi/password', data)
            .subscribe(
                res => {
                    if (res > 0) {
                        this.success = true;
                        setTimeout(() => {
                            this.dialogRef.close();
                        }, 1000);
                    }
                },
                err => {
                    console.log(err);
                }
            );
      }
  }

}
