import { WebsocketService } from './../websocket.service';
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
  departments: any = [];
  services: any = [];
  accounts: any = [];

  constructor(public http: HttpClient,
              public userService: UserService,
              public dialog: MatDialog,
              public websocketService: WebsocketService) {
                  this.websocketService.departmentsUpdated.subscribe(async () => {
                    await this.getAllDepartments();
                  });
              }

  async ngOnInit() {
    await this.getAllDepartments();
    await this.getAllServices();
    await this.getAllAccounts();
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

  async getAllAccounts() {
    const url = '/localapi/users';
    await this.http.get(url)
    .subscribe(
      data => {
        this.accounts = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  showAccountDialog(id) {
    this.dialog.open(UserComponent, {
      data: {
        id
      }
    });
  }

  showDepartmentDialog(id) {
    this.dialog.open(DepartmentComponent, {
      data: {
        id
      }
    });
  }

  showServicesDialog(id) {
    this.dialog.open(ServicesDialogComponent, {
      data: {
        id
      }
    });
  }

}
