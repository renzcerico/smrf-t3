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
  dateSelected: string;
  minDate: string;
  maxDate: string;
  constructor(private activityFactory: ActivityFactory,
              private activeModal: NgbActiveModal,
              private activityService: ActivityService, ) {
  this.startTime = '';
  this.endTime = 'HHmm';
  }

  ngOnInit() {
    this.minDate = moment(this.actualStart).subtract(1, 'day').format('YYYY-MM-DD');
    this.maxDate = moment(this.actualStart).add(1, 'day').format('YYYY-MM-DD');
    this.dateSelected = moment(this.actualStart).format('YYYY-MM-DD');
  }

  updateStartTime() {
    if (this.startTime.length === 4 ) {
      const time = parseInt(this.startTime.slice(0, 2), 10);
      const min = parseInt(this.startTime.slice(2, 4), 10);
      const timeStr = moment(this.dateSelected).format('MM/DD/YYYY') + ' ' + time + ':' + min;
      this.fullStartTime = moment(timeStr);
      this.fullEndTime = moment(this.fullStartTime).add(1, 'hours').startOf('hour');
      const endTimeObj = moment(this.fullEndTime).format('HHmm');
      this.endTime = endTimeObj;
    } else {
      this.endTime = '';
    }
  }

  updateEndTime() {
    if (this.startTime.length === 4 ) {
      const time = parseInt(this.endTime.slice(0, 2), 10);
      const min = parseInt(this.endTime.slice(2, 4), 10);
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
    if (!moment(this.dateSelected).isBetween(moment(this.minDate).subtract(1, 'day'), moment(this.maxDate).add(1, 'day'))) {
      res = {
        isValid: false,
        message: 'Invalid Date'
      };
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
