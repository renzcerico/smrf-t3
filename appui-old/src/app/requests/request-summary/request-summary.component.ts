import { UserService } from './../../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Injectable, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-request-summary',
  templateUrl: './request-summary.component.html',
  styleUrls: ['./request-summary.component.css']
})
export class RequestSummaryComponent implements OnInit {
  controlNumber = '010320201';
  dateRequested = 'Jan. 03, 2020';
  requestedBy = 'R. Cerico';
  approvedBy = 'A. Approver';
  requestedPriority = 'NORMAL';
  requestedDateRequired = 'Jan. 25, 2020';
  requestedDepartment = 'opt';
  requestedMachine = 'SO01';
  reqDetails;
  reqRepresentative;
  reqStatus;
  reqNotes;
  deptHead;

  attrAttachment = false;
  requestedAttachment = '../../assets/img/backend.jpg';

  serviceRep;
  reqIncharge;

  @Input() setRequest;
  @Input() transferRequest = false;
  successTransfer = true;
  userLevel: string;
  attachments: any;

  constructor(public http: HttpClient,
              public route: ActivatedRoute,
              public router: Router,
              public userService: UserService,
              private sanitizer: DomSanitizer) { }

  async ngOnInit() {
    // this.setRequest = 12;

    this.userLevel = this.userService.userLevel;
    await this.getRequest();
    // this.reqDetails = this.setRequest.req_details;

    this.getServiceRepresentative();
  }

  async getRequest() {
    const id = this.route.snapshot.paramMap.get('id');
    const url = '/localapi/requests/' + id;
    const result = await this.http.get(url).toPromise();
    const request = 'request';
    const details = 'details';
    const attachments = 'attachments';

    this.controlNumber = result[request][0].REQ_ID;
    this.requestedPriority = result[request][0].REQ_PRIORITY;
    this.requestedDateRequired = result[request][0].REQ_DATE_REQUIRED;
    this.dateRequested = result[request][0].REQ_CREATION_DATE;
    this.requestedBy = result[request][0].REQ_REQUESTED_BY;
    this.approvedBy = result[request][0].REQ_SR_REPRESENTATIVE;
    this.reqStatus = result[request][0].REQ_STATUS;
    this.reqNotes = result[request][0].REQ_NOTES;
    this.reqDetails = result[details];
    this.deptHead = result[request][0].DEPT_HEAD;
    this.attachments = result[attachments];
    await this.attachments.forEach((el, i) => {
      this.attachments[i].IMG = this.sanitizer.bypassSecurityTrustUrl('localapi/uploads/appui/' + el.IMG);
    });

    // return result;
    // this.setRequest.controlNumber = this.controlNumber;

  }

  setAttachment() {
    this.attrAttachment = !this.attrAttachment;
  }

  getServiceRepresentative() {
    const url = '/localapi/service-representatives';
    this.http.get(url)
      .subscribe(
          data => {
              this.serviceRep = data;
          },
          err => {
              console.log(err);
          });
  }

  selectChangeHandler(event) {
    // update the ui
    this.reqIncharge = this.serviceRep.find(el => el.PERSON_ID === event).FULL_NAME;
    // this.reqRepPersonID = this.serviceRep[event.value].PERSON_ID;
  }

  transferManpower(manpower) {
    const url = '/localapi/request/transfer';
    const id = this.controlNumber;

    const data = {
      req_id: id,
      req_person_id: manpower
    };

    this.http.post(url, data)
            .subscribe(
                res => {
                  const data: any = res;

                  if (data.output === 'Y') {
                    this.successTransfer = !this.successTransfer;

                    setTimeout(() => {
                      this.successTransfer = !this.successTransfer;
                      this.router.navigate(['/job']);
                    }, 2000);
                  }
                },
                err => {
                    console.log(err);
                }
            );
  }

}
