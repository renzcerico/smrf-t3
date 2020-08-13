import { HttpClient } from '@angular/common/http';
import { UserService } from '../../user.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { requests } from '../../request';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit, AfterContentChecked {

  requestsList = [];
  jobTableHeader: string;
  jobRouter: string;
  jobTitle: string;
  jobStatus: string;
  jobStatusText: string;
  port = '/localapi/';
  req: any = [];
  isAdmin = false;
  jobTableData: string;

  constructor(public userService: UserService, public http: HttpClient) { }

  async ngOnInit() {
    this.isAdmin = this.userService.userLevel === 'admin' ? true : false;
    this.requestsList = [];
    await this.getAllRequest();
  }

  ngAfterContentChecked() {
    this.requestsList = [];

    this.req.forEach(element => {
      if (element.REQ_STATUS === this.userService.jobOrder) {
        this.requestsList.push(element);
      }
    });

    if (this.userService.jobOrder === 1) {
      this.jobRouter = '/jobs/';
      this.jobTitle = 'Pick "NEW" Service Requests';
      this.jobTableHeader = 'Request <br />No.';
      this.jobTableData = 'RN';
      this.jobStatus = 'New!';
      this.jobStatusText = 'text-info';
    } else if (this.userService.jobOrder === 2) {
      this.jobRouter = '/manage-jobs/';
      this.jobTitle = 'Manage Assigned Job Orders';
      this.jobTableHeader = 'Job Order <br />No.';
      this.jobTableData = 'JO'
      this.jobStatus = 'Wip';
      this.jobStatusText = 'text-danger';
    } else if (this.userService.jobOrder === 3) {
      this.jobRouter = '/manage-jobs/';
      this.jobTitle = 'Manage Assigned Job Orders';
      this.jobStatus = 'Completed';
      this.jobStatusText = 'text-primary';
    } else if (this.userService.jobOrder === 4) {
      this.jobRouter = '/closed/';
      this.jobTitle = 'Manage Assigned Job Orders';
      this.jobStatus = 'closed';
      this.jobStatusText = 'text-dark';
    }
  }

  async getAllRequest() {
    let url = this.port;
    let res;

    if (this.userService.user.user_level === 'admin') {
      url = url + 'jobs';
      res = await this.http.get(url).toPromise();
    } else {
      url = url + 'jobs/user/' + this.userService.user.id;
      res = await this.http.get(url).toPromise();
    }

    this.req = res;
    // console.log(this.req);
  }

}
