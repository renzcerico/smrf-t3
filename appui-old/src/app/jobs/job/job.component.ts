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
  jobRouter: string;
  jobTitle: string;
  jobStatus: string;
  jobStatusText: string;
  port = '/localapi/';
  req: any = [];

  constructor(public userService: UserService, public http: HttpClient) { }

  async ngOnInit() {
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
      this.jobStatus = 'New!';
      this.jobStatusText = 'text-info';
    } else if (this.userService.jobOrder === 2) {
      this.jobRouter = '/manage-jobs/';
      this.jobTitle = 'Manage Assigned Job Orders';
      this.jobStatus = 'Wip';
      this.jobStatusText = 'text-danger';
    } else if (this.userService.jobOrder === 3) {
      this.jobRouter = '/manage-jobs/';
      this.jobTitle = 'Manage Assigned Job Orders';
      this.jobStatus = 'Completed';
      this.jobStatusText = 'text-primary';
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
  }

}
