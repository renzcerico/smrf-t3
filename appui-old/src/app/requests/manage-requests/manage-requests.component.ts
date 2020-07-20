import { UserService } from './../../user.service';
import { HttpClient } from '@angular/common/http';
import { RequestService } from './../../request-service.service';
import { RequestModalComponent } from '../request-modal/request-modal.component';
import { Component, OnInit } from '@angular/core';
import { requests } from '../../request';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-requests',
  templateUrl: './manage-requests.component.html',
  styleUrls: ['./manage-requests.component.css']
})
export class ManageRequestsComponent implements OnInit {

  assignedPerson;
  requestsList = [];
  req: any;
  port = '/localapi/';

  constructor(public dialog: MatDialog,
              public reqSer: RequestService,
              public http: HttpClient,
              public userService: UserService) { }

  async ngOnInit() {
    this.assignedPerson = this.userService.userLevel === 'requestor' ? 'Dept. Head' : 'Created By';

    await this.getAllRequest();

    this.req.forEach(element => {
        // console.log(element.REQ_STATUS);
        // const userID = element.CREATED_BY;
        // const approver = element.APPROVED_BY;
        // const repID = element.REP_PERSON_ID;
        // const currentUser = this.userService.user.id;

        // if (this.authenticate(userID) || approver === currentUser || repID === currentUser) {
        // if (element.REQ_STATUS === 0 || element.REQ_STATUS === 1 ||
        //   element.REQ_STATUS === 2 || element.REQ_STATUS === 3) {
          if (element.REQ_STATUS === 0) {
            element[`REQ_STATUS`] = 'Pending';
            element[`color`] = 'text-danger';
            element[`router`] = '/requests/';
            this.requestsList.push(element);
          } else if ((element.REQ_STATUS === 1) && (this.userService.userLevel === 'requestor')) {
            element[`REQ_STATUS`] = 'Open';
            element[`color`] = 'text-secondary';
            element[`router`] = '/manage-jobs/';
            this.requestsList.push(element);
          } else if ((element.REQ_STATUS === 1) && (this.userService.userLevel === 'head')) {
            element[`REQ_STATUS`] = 'Open';
            element[`color`] = 'text-secondary';
            element[`router`] = '/requests/';
            this.requestsList.push(element);
          } else if (element.REQ_STATUS === 2) {
            element[`REQ_STATUS`] = 'WIP';
            element[`color`] = 'text-info';
            element[`router`] = '/completed/';
            // element[`router`] = '/manage-jobs/';
            this.requestsList.push(element);
          } else {
            element[`REQ_STATUS`] = 'completed!';
            element[`color`] = 'text-success';
            element[`router`] = '/completed/';
            this.requestsList.push(element);
          }
        // }
      // }
    });
  }

  authenticate(user) {
    if (user === this.userService.user.id || this.userService.user.user_level === 'admin') {
      return true;
    }
    return false;
  }

  async getAllRequest() {
    let url = this.port;
    let res;

    if (this.userService.user.user_level === 'admin') {
      url = url + 'requests';
      res = await this.http.get(url).toPromise();
    } else {
      url = url + 'requests/user/' + this.userService.user.id;
      res = await this.http.get(url).toPromise();
    }

    this.req = res;
  }
}
