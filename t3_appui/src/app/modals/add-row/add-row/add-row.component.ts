import { ActivityService } from './../../../services/activity.service';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityFactory } from 'src/app/classes/activity-factory';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-row',
  templateUrl: './add-row.component.html',
  styleUrls: ['./add-row.component.css']
})
export class AddRowComponent implements OnInit {

  startTime: string;
  endTime: string;
  fullStartTime: any;
  fullEndTime: any;
  actualStart: string;
  dateSelected: Date;
    constructor(private activityFactory: ActivityFactory, private activeModal: NgbActiveModal, private activityService: ActivityService, ) {
    this.startTime = '';
    this.endTime = 'HHmm';
  }

  ngOnInit() {
  }

  limit(val= '', key) {
    const pattern = /^['0-9']$/i;
    const count = val.toString().length;

    if (pattern.test(key)) {
      if (count === 4) {
        return false;
      }
    }
  }

  updateStartTime() {
    if (this.startTime.length === 4 ) {
      const time = this.startTime.slice(0, 2);
      const min = this.startTime.slice(2, 4);
      const timeStr = moment(this.dateSelected).format('MM/DD/YYYY') + ' ' + time + ':' + min;
      this.fullStartTime = moment(timeStr);
      this.fullEndTime = moment(this.fullStartTime).add(1, 'hours').startOf('hour');
      const endTimeObj = moment(this.fullEndTime).format('HHmm');
      this.endTime = endTimeObj;
    } else {
      this.endTime = 'HHmm';
    }
  }

  updateEndTime() {
    if (this.startTime.length === 4 ) {
      const time = this.endTime.slice(0, 2);
      const min = this.endTime.slice(2, 4);
      const timeStr = moment(this.dateSelected).format('MM/DD/YYYY') + ' ' + time + ':' + min;
      this.fullEndTime = moment(timeStr);
    }
  }

  addRow() {
    const act = this.activityFactory.createActivity({
      HEADER_ID       : this.activityService.headerObj.ID,
      START_TIME      : this.fullStartTime,
      END_TIME        : this.fullEndTime,
      IS_NEW          : 1,
    });
    console.log(act);
    const validate = this.validate(act.START_TIME, act.END_TIME);
    if (validate.isValid) {
      this.activityService.addCustomActivity(act);
      this.activeModal.dismiss('success');
    } else {
      Swal.fire({
        title: 'Warning',
        text: validate.message,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
  }

  validate(startTime: string, endTime: string) {
    const mntStart = moment(startTime);
    const mntEnd = moment(endTime);
    let res = {
      isValid: true,
      message: 'Allowed'
    };
    if (!mntStart.isValid() || !mntEnd.isValid()) {
      res = {
        isValid: false,
        message: 'Invalid Value'
      };
      return res;
    }
    if (!this.activityService.isActivityAllowed(startTime)) {
      res = {
        isValid: false,
        message: 'An activity with given start time already exists'
      };
      return res;
    }
    if ((mntEnd.diff(mntStart.startOf('hour'), 'minutes')) > 60) {
      res = {
        isValid: false,
        message: 'Invalid end time'
      };
      return res;
    }
    return res;
  }

}
