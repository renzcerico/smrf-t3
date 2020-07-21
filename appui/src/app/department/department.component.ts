import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
// import { ReactiveFormsModule , FormGroup, FormControlName, Validators, FormControl } from '@angular/forms';

export interface DialogData {
  id: number;
}
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departmentName;
  representativeID: number;
  serviceRepresentativeID: number;
  departmentID: number;
  users: Array<{ id: number, name: string }> = [];
  editDepartment = false;

  constructor(public http: HttpClient, public router: Router, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.departmentID = this.data.id;
    this.getUsersByDepartment();
    this.getDepartmentDetails();
  }

  submitDepartment() {
    // Add department
    if (!this.editDepartment) {
        this.addDepartment();
        return;
    }

    if (this.editDepartment) {
        // Update department
        this.updateDepartment();

        if (this.serviceRepresentativeID) {
            // Update service representative
            this.updateServiceRepresentative();
            return;
        }

        // Add service representative
        this.addServiceRepresentative();
    }
  }

  addServiceRepresentative() {
    const data = {
      departmentID: this.departmentID,
      department: this.departmentName,
      representativeID: this.representativeID
    };

    this.http.post('localapi/service-representatives', data)
        .subscribe(
            res => {
              console.log(res);
            },
            err => {
                console.log(err);
            }
        );
  }

  updateServiceRepresentative() {
    const data = {
      departmentID: this.departmentID,
      department: this.departmentName,
      representativeID: this.representativeID
    };

    this.http.post('localapi/service-representatives/' + this.serviceRepresentativeID, data)
        .subscribe(
            res => {
              console.log(res);
            },
            err => {
                console.log(err);
            }
        );
  }

  addDepartment() {
    if (this.departmentName) {
        const json = {
          departmentName: this.departmentName
        };

        this.http.post('localapi/departments', json)
            .subscribe(
                res => {
                  console.log(res);
                },
                err => {
                  console.log(err);
                }
            );
    }
  }

  updateDepartment() {
    if (this.departmentName) {
      const json = {
        departmentName: this.departmentName
      };

      this.http.post('localapi/departments/' + this.departmentID, json)
          .subscribe(
              res => {
                console.log(res);
              },
              err => {
                console.log(err);
              }
          );
    }
  }

  getUsersByDepartment() {
      const department = this.departmentID;

      if (department) {
        this.editDepartment = !this.editDepartment;

        this.http.get('localapi/users/dept/' + department)
            .subscribe(
                res => {
                    const data = res;

                    for (let i = 0; i < data.length; i++) {
                      const json = {
                          id: data[i].ID,
                          name: data[i].FULL_NAME,
                      };

                      this.users.push(json);
                    }
                },
                err => {
                  console.log(err);
                }
            );
      }
  }

  getDepartmentDetails() {
      const department = this.departmentID;

      if (department) {
        this.http.get('localapi/departments/' + department)
        .subscribe(
          res => {
            this.departmentName = res[0].NAME;
            this.representativeID = res[0].PERSON_ID;
            this.serviceRepresentativeID = res[0].REP_ID;
          },
          err => {
            console.log(err);
          }
          );
      }
  }

}
