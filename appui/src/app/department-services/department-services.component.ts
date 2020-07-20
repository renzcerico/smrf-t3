import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserComponent } from './../user/user.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './../user.service';
import { DepartmentComponent } from './../department/department.component';
import { ServicesDialogComponent } from './../services-dialog/services-dialog.component';

@Component({
  selector: 'app-department-services',
  templateUrl: './department-services.component.html',
  styleUrls: ['./department-services.component.css']
})
export class DepartmentServicesComponent implements OnInit {
  departments: any;
  services: any;

  constructor(public http: HttpClient,
              public userService: UserService,
              public dialog: MatDialog) { }

  async ngOnInit() {
    await this.getAllDepartments();
    await this.getAllServices();
  }

  async getAllDepartments() {
    const url = '/localapi/departments';
    await this.http.get(url)
      .subscribe(
        data => {
          this.departments = data;
        },
        err => {
          console.log(err);
        }
      );
  }

  async getAllServices() {
    const url = '/localapi/services';
    await this.http.get(url)
    .subscribe(
      data => {
        this.services = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  account() {
    this.dialog.open(UserComponent);
  }

  showDepartmentDialog() {
    this.dialog.open(DepartmentComponent);
  }

  showServicesDialog() {
    this.dialog.open(ServicesDialogComponent);
  }

}
