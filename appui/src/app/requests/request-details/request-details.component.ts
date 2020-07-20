import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { RequestFormComponent } from './../request-form/request-form.component';
import { UserService } from '../../user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { requests } from '../../request';
import { requestList } from '../../request-list';
// import { BaseService} from './../../_services/base.service';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css', './../request/request.component.css']
})
export class RequestDetailsComponent implements OnInit {
  request;
  reqRecipient;
  reqDateRequired;
  reqPriority;
  reqMachine = 'none';
  reqDepartment = '';
  reqMachineStopped;
  reqDescription;
  reqDetails;
  reqStatus;
  requestList = requestList;
  controlNumber = '010320201';
  requestedBy = 'R. Cerico';
  approvedBy = 'A. Approver';
  userLevel: string;
  dateRequested = 'Jan. 03, 2020';
  requestedPriority = 'NORMAL';
  requestedDateRequired = 'Jan. 25, 2020';
  requestedDepartment = 'opt';
  requestedMachine = 'SO01';
  reqRepId;
  deptHead;
  result: any = null;

  requestType = 'details';
  requestId: number;

  attrAttachment = false;
  // requestedAttachment = '../../assets/img/backend.jpg';
  requestedAttachment = [];
  reqNotes: string;
  notificationStatus = true;
  notificationResult = '';

  setRequestList;
  reqSelect;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public http: HttpClient,
              public userService: UserService,
              public requestForm: RequestFormComponent) { }

  async ngOnInit() {
    await this.getRequest();
    // await this.getRequestList(this.reqRepId);
    this.userLevel = this.userService.userLevel;
  }

  setAttachment() {
    this.attrAttachment = !this.attrAttachment;
  }

  msg() {
    setTimeout(() => {
      this.notificationStatus = !this.notificationStatus;
      this.router.navigate(['/manage-request']);
    }, 2000);
  }

  // Update request
  requestStatus(bool) {
    const id = this.route.snapshot.paramMap.get('id');
    const reqStatus = bool ? 1 : -1;

    const url = '/localapi/request-details/' + id;

    const data = {
        req_id: id,
        req_notes: this.reqNotes,
        req_status: reqStatus
    };
    
    this.http.post(url, data)
             .subscribe(
               res => {
                  const data: any = res;

                  if (data.output === 'Y') {
                    this.requestUpdate(bool, false);

                    this.notificationStatus = !this.notificationStatus;
                    const result = bool ? 'approved' : 'rejected';
                    this.notificationResult = 'Request has been ' + result;

                    this.msg();
                  }
               },
               err => {
                  console.log(err);
               }
             );
  }

  requestUpdate(status, showMsg) {
    const id = this.route.snapshot.paramMap.get('id');
    const url = '/localapi/request/details/' + id;

    this.http.post(url, this.reqDetails)
        .subscribe(
          res => {
            if (showMsg) {
              const msg = status ? 'updated' : 'deleted';

              this.notificationStatus = !this.notificationStatus;
              this.notificationResult = 'You have been successfully ' + msg + ' a request.';

              this.msg();
            }
          },
          err => {
            console.log(err);
          }
        );

  }

  previewImg(img) {
    this.requestForm.previewImg(img);
  }

  async getRequest() {
    const httpOptions = {
        headers: new HttpHeaders({ 
          'Access-Control-Allow-Origin':'*'
        })
    };

    const id = this.route.snapshot.paramMap.get('id');
    // const url = 'http://localhost:3000/api/requests/' + id;
    const url = '/localapi/requests/' + id;
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    // const result = await this.http.get(url).toPromise();
    const request = 'request';
    const details = 'details';
    const attachments = 'attachments';

    await this.userService.getAPI(url).subscribe((response: any) => {
      const result = response;

      this.controlNumber = result[request][0].REQ_ID;
      this.requestedPriority = result[request][0].REQ_PRIORITY;
      this.requestedDateRequired = result[request][0].REQ_DATE_REQUIRED;
      this.dateRequested = result[request][0].REQ_CREATION_DATE;
      this.requestedBy = result[request][0].REQ_REQUESTED_BY;
      this.approvedBy = result[request][0].REQ_SR_REPRESENTATIVE;
      this.reqStatus = result[request][0].REQ_STATUS;
      this.reqRepId = result[request][0].REQ_REP_ID;
      this.reqDetails = result[details];
      this.deptHead = result[request][0].DEPT_HEAD;
      this.requestedAttachment = result[attachments];

      this.getRequestList(this.reqRepId);

    });

    // this.controlNumber = result[request][0].REQ_ID;
    // this.requestedPriority = result[request][0].REQ_PRIORITY;
    // this.requestedDateRequired = result[request][0].REQ_DATE_REQUIRED;
    // this.dateRequested = result[request][0].REQ_CREATION_DATE;
    // this.requestedBy = result[request][0].REQ_REQUESTED_BY;
    // this.approvedBy = result[request][0].REQ_SR_REPRESENTATIVE;
    // this.reqStatus = result[request][0].REQ_STATUS;
    // this.reqRepId = result[request][0].REQ_REP_ID;
    // this.reqDetails = result[details];
    // this.deptHead = result[request][0].DEPT_HEAD;

    // return result;
  }

  async getRequestList(dept) {
    const url = '/localapi/request-list';
    const representative = { department: dept };

    await this.http.post(url, representative)
             .subscribe(
                 data => {
                   this.setRequestList = [];
                   this.setRequestList = data;
                 },
                 err => {
                     console.log(err);
                 }
             );
  }

  // Remove a request.
  remove(id) {
    console.log(this.reqDetails);
    // for (let i = 0; i < this.reqDetails.length; i++) {
    //   if (this.reqDetails[i].request === id) {
          // this.reqDetails.splice(id, 1);
    //   }
    // }
    this.reqDetails.splice(id, 1);

    return false;
  }

}
