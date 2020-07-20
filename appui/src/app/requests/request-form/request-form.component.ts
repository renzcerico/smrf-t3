import { RequestModalComponent } from './../request-modal/request-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { RecipientComponent } from '../../recipient/recipient.component';
import { recipient } from '../../recipient';
import { requestList } from '../../request-list';
import { Component, OnInit, Injectable, Input, Output, EventEmitter, ModuleWithComponentFactories,
         AfterContentChecked } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit, AfterContentChecked {
  reqPriority = 'normal';
  reqDateRequired = '';
  reqMachine;
  reqDepartment: number;
  reqRepresentative;
  reqDetails = [];
  reqMachineStopped = '';
  reqMachineResumed = '';
  reqRecipient;
  json = {};
  errorRequired = true;
  successRequest = true;
  errorNum = 0;
  userLevel: string;
  reqStatus: string;
  reqAttachment = [];
  reqNotes;

  request = requestList;
  setRequestList;
  reqSelect;
  reqRemarks;
  serviceRep;
  departments;

  response;
  reqIncharge;
  reqRepID;
  reqRepPersonID;

  attch: any;

  @Input() requestType: any;
  @Input() requestId: number;
  @Input() requestDetails;
  myImage: any;
  widthContent = false;
  fileToPush = [];
  minDate: Date = new Date();
  minDateValidation = false;

  constructor(public http: HttpClient, public userService: UserService, public dialog: MatDialog) { }

  ngOnInit() {
    this.userLevel = this.userService.userLevel;
    this.reqDepartment = parseInt(this.userService.user.department, 10);
    this.getServiceRepresentative();
    this.getDepartments();
    this.requestTypeChecking();
  }

  ngAfterContentChecked() {
    this.getDetails();
    // this.setRequestList;
    this.reqAttachment = this.userService.srvcRequestAttachment;
  }

  // Checking type of request (request, approve, create job, order, done)
  requestTypeChecking() {
    if (this.requestType === 'request') {
      this.requestType = 'request';
    } else if (this.requestType === 'details') {
      this.getDetails();
      // this.changeRepresentative(this.reqRepresentative);
    }
  }

  // Get details if record is existing.
  getDetails() {
    if (this.requestType !== 'request') {
      this.reqPriority =  this.requestDetails.priority;
      this.reqDateRequired = this.requestDetails.date_required;
      this.reqMachine = this.requestDetails.machine;
      // this.reqDepartment = this.requestDetails.department;
      this.reqRepresentative = this.requestDetails.representative;
      this.reqDetails = this.requestDetails.req_details;
      this.reqRecipient = this.requestDetails.recipient;
      this.reqStatus = this.requestDetails.status;
    }
  }

  dateRequiredInput(val) {
    this.reqDateRequired = val;
  }

  // Validation for required fields.
  requiredFields() {
    const inputDate = moment(this.reqDateRequired).format('YYYY/MM/DD');
    const currentDate = moment(this.minDate).format('YYYY/MM/DD');

    if (this.reqDateRequired === '' || this.reqDetails.length === 0) {
      this.error();
    } else if (moment(inputDate) < moment(currentDate)) {
      this.errorNum = 1;
      this.minDateValidation = true;
    } else {
      if (this.userLevel === 'user') {
        this.reqRecipient = this.userService.recipient;

        if (this.reqRecipient === '') {
          this.error();
        }
      } else {
        this.reqRecipient = 0;
      }
      this.errorNum = 0;
    }
  }

  // Display error.
  error() {
    this.errorNum = 1;
    this.errorRequired = false;

    setTimeout(() => {
        this.errorRequired = true;
    }, 3000);
  }

  // Set priority if urgent / not.
  priority(val) {
    this.reqPriority = val;
  }

  requestStatus() {
    const userLevel = this.userService.user.user_level;
    const auth = ['admin', 'supervisor', 'head'];
    let status = 0;

    auth.includes(userLevel) ? status = 1 : status = 0;
    return status;
  }

  // If button save was clicked.
  btnRequest(form) {
      this.requiredFields();

      console.log(this.errorNum);
      if (this.errorNum === 0) {

          // this.json = {
          //   reqRecipient: this.userService.recipient,
          //   reqDateRequired: moment(this.reqDateRequired).format('DD-MMM-YYYY HH:mm:ss').toString(),
          //   reqPriority: this.reqPriority,
          //   reqMachine: this.reqMachine,
          //   // reqDepartment: this.userService.user.department,
          //   reqRepresentative: this.reqRepresentative,
          //   reqDetails: this.reqDetails,
          //   reqAttachment: this.attch,
          //   reqNotes: this.reqNotes,
          //   reqRepPersonID: this.reqRepPersonID,
          //   createdBy: this.userService.user.id,
          //   status: this.requestStatus()
          // };
          const formData = new FormData();
          formData.append('reqRecipient', this.userService.recipient);
          formData.append('reqDateRequired',  moment(this.reqDateRequired).format('DD-MMM-YYYY HH:mm:ss').toString());
          formData.append('reqPriority', this.reqPriority);
          formData.append('reqMachine', this.reqMachine);
          formData.append('createdBy', this.userService.user.id);
          formData.append('reqRepresentative', this.reqRepresentative);
          this.reqDetails.forEach((el, i) => {
            formData.append('reqDetails', JSON.stringify(el));
          });
          this.fileToPush.forEach((el, i) => {
            formData.append('reqAttachment', el, el.name);
          });
          formData.append('reqNotes', this.reqNotes || '');
          formData.append('reqRepPersonID', this.reqRepPersonID);
          formData.append('status', this.requestStatus().toString());
          const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'multipart/form-data',
            }),
        };
          this.http.post('/localapi/requests?request_id=0', formData/* , httpOptions */)
                  .subscribe(
                    res => {
                      this.response = res;

                      if (this.response.success === 'Y') {
                          this.successRequest = !this.successRequest;

                          setTimeout(() => {
                            this.successRequest = !this.successRequest;
                            form.resetForm('');
                            this.reset();
                          }, 3000);
                      } else {
                        alert('Error! ' + this.response.success);
                      }

                    }, err => {
                      console.log(err);
                    }
                  );
      }
  }

  // Reset form
  reset() {
    this.reqPriority = 'normal';
    this.reqMachine = 'none';
    this.reqDetails = [];
    this.reqRecipient = 0;
    this.reqNotes = '';
    this.userService.srvcRequestAttachment = [];
  }

  // Add a request.
  setRequestDetails(val) {
    const remarks = this.reqRemarks;
    const request: any = this.reqSelect;
    const description = $('#reqSelect').text();
    const json = {
      dtl_id: 0,
      request,
      description,
      remarks
    };

    if (request > 0 && remarks != null) {
      const isExists = this.reqDetails.some(data => parseInt(data.request, 10) === parseInt(request, 10));
      if (!isExists) {
        this.reqDetails.push(json);
      }
    }

    this.reqSelect = 0;
    this.reqRemarks = '';
    ($('#reqSelect') as any).focus();

  }

  // Remove a request.
  remove(id) {
    for (let i = 0; i < this.reqDetails.length; i++) {
      if (this.reqDetails[i].request === id) {
          this.reqDetails.splice(i, 1);
      }
    }

    return false;
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

  getDepartments() {
    const url = '/localapi/departments';
    this.http.get(url)
             .subscribe(
                 data => {
                     this.departments = data;
                 },
                 err => {
                     console.log(err);
                 }
              );
  }

  getRequestList(dept) {
    const url = '/localapi/request-list';
    const representative = { department: dept };

    this.http.post(url, representative)
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

  selectChangeHandler(event) {
    // update the ui
    this.reqIncharge    = this.serviceRep.find(el => el.REP_ID === event.value).FULL_NAME;
    this.reqRepPersonID = this.serviceRep.find(el => el.REP_ID === event.value).PERSON_ID;
    this.getRequestList(this.serviceRep.find(el => el.REP_ID === event.value).REP_ID);

  }

  attachmentChange(file, attachment) {
    const fileExtension = attachment.split('.').pop();
    const reader = new FileReader();
    const array = ['jpg', 'jpeg', 'png'];

    if (array.includes(fileExtension)) {
      reader.readAsDataURL(file[0]);
      this.fileToPush.push(file[0]);
      // tslint:disable-next-line: variable-name
      reader.onload = (_event) => {
        this.userService.srvcRequestAttachment.push(reader.result);
      };
    }

    $('#reqAttachment').val('');

  }

  removeImg(index) {
    this.dialog.open(RequestModalComponent, { data: {index} });
    return false;
  }

  previewImg(img) {
    this.userService.myImage = img;
  }

}
