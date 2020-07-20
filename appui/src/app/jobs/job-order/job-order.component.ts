import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { requests } from './../../request';
// import { requestList } from './../request-list';

@Component({
  selector: 'app-job-order',
  templateUrl: './job-order.component.html',
  styleUrls: ['./job-order.component.css', './../../requests/request/request.component.css']
})
export class JobOrderComponent implements OnInit {
  manpowerList = [];
  requestType = 'details';
  request;

  constructor(private route: ActivatedRoute, public http: HttpClient) { }

  async ngOnInit() {
    // this.route.paramMap.subscribe(params => {
    //   this.request = requests[+params.get('id') - 1];
    // });
    await this.getRequest();
  }

  async getRequest() {
    const id = this.route.snapshot.paramMap.get('id');
    const url = '/localapi/requests/' + id;
    this.request = await this.http.get(url).toPromise();

    // const request = 'request';
    // const details = 'details';

    // this.controlNumber = result[request][0].REQ_ID;
    // this.requestedPriority = result[request][0].REQ_PRIORITY;
    // this.requestedDateRequired = result[request][0].REQ_DATE_REQUIRED;
    // this.dateRequested = result[request][0].REQ_CREATION_DATE;
    // this.requestedBy = result[request][0].REQ_REQUESTED_BY;
    // this.approvedBy = result[request][0].REQ_SR_REPRESENTATIVE;
    // this.reqStatus = result[request][0].REQ_STATUS;
    // this.reqDetails = result[details];
  }
}
