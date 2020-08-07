import { ServertimeService } from './../services/servertime.service';
import { HeaderService } from './../services/header.service';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  Input,
  OnInit,
  AfterContentChecked,
  ChangeDetectorRef,
} from '@angular/core';
import * as moment from 'moment';
import {ActivityService} from '../services/activity.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivityDetailsComponent } from '../activity-details/activity-details.component';
import { ActivityDowntimeComponent } from '../activity-downtime/activity-downtime.component';
import { UserService } from './../services/user.service';
import Swal from 'sweetalert2';
import { AddRowComponent } from '../modals/add-row/add-row/add-row.component';
import { HeaderFactory } from './../classes/header-factory';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css', '../material/material.component.css', '../app.component.css']
})
export class ActivityComponent implements OnInit {

  @ViewChildren('contentTr') contentTr !: QueryList<ElementRef>;
  @ViewChildren('editableTd') editableTd !: QueryList<ElementRef>;
  @ViewChildren('headerInput') headerInput !: QueryList<ElementRef>;
  mLotNumber: string;
  mPacked = 0;
  mAdjustment = 0;
  actualTime: any = {};
  activities: any = [];
  downtimeTypes: any = [];
  selectedActivityIndex = 7;
  activeUser;
  userID;
  userType: number;
  isAuthorized: boolean;
  isToEndProd: boolean;
  headerObj: any;
  servertime: string;
  lastActivity: any;

  get subTotal() {
    let subTotal = 0;
    if (this.activities.length) {
      this.activities.forEach( (el) => {
        subTotal += el.TOTAL;
      });
    }
    return subTotal;
  }

  get outputPerMinuteSubtotal() {
    let outputPerMinuteSubtotal = 0;
    if (this.activities.length) {
      this.activities.forEach( (el) => {
        outputPerMinuteSubtotal += el.OUTPUT_PER_MINUTE;
      });
    }
    return Math.floor(outputPerMinuteSubtotal);
  }

  get packedSubTotal() {
    let subTotal = 0;
    if (this.activities.length) {
      this.activities.forEach( (el) => {
        subTotal += el.PACKED_QTY;
      });
    }
    return subTotal;
  }

  get adjSubTotal() {
    let subTotal = 0;
    if (this.activities.length) {
      this.activities.forEach( (el) => {
        subTotal += el.ADJ_QTY;
      });
    }
    return subTotal;
  }

  get downtimeSubTotal() {
    let subTotal = 0;
    if (this.activities.length) {
      this.activities.forEach( (el) => {
        subTotal += el.TOTAL_DOWNTIME;
      });
    }
    return subTotal;
  }

  constructor(
      public activityService: ActivityService,
      private cdr: ChangeDetectorRef,
      private modalService: NgbModal,
      private headerService: HeaderService,
      private serverTimeService: ServertimeService,
      private headerFactory: HeaderFactory,
      private userService: UserService) {
    activityService.activities$.subscribe(
      activities => {
        this.activities = activities;
        // this.isToEndProd = false;
        this.lastActivity = this.activities[0];
      }
    );
    activityService.downtimeTypes$.subscribe(
      downtimeTypes => {
        this.downtimeTypes = downtimeTypes;
      }
    );
    activityService.actualTime$.subscribe(
      actualTime => {
        this.actualTime = actualTime;
      }
    );
    userService.isAuthorized$.subscribe(isAuthorized => {
      this.isAuthorized = isAuthorized;
    });
    headerService.header$.subscribe(
      data => {
          this.headerObj = data;
      }
    );
    serverTimeService.time$.subscribe(
      res => {
        this.servertime = res.format();
      });
  }

  ngOnInit() {
    this.userService.user.subscribe(
      res => {
        if (res) {
          this.activeUser = res;
        }
      },
        err => {
        console.log(err);
      }
    );
  }

  handleKeyDown(event) {
    event.preventDefault();
  }

  handleTrKeyUp(event) {
    const elArr = this.editableTd.toArray();

    const active = elArr.findIndex(index => {
      return (index.nativeElement.parentElement === event.target.parentElement);
    });

    if (event.target.attributes.required && !event.target.value) {
      return;
    }

    if (active < elArr.length - 1) {
      elArr[active + 1].nativeElement.focus();
    } else {
      event.target.blur();
    }
  }

  valueChanged(index: number) {
    this.activities[index].IS_CHANGED = 1;
    // this.activities[index].LAST_UPDATED_BY = this.activeUser.ID;
  }

  openModal(event, index) {
    const modalRef = this.modalService.open(ActivityDetailsComponent,
      {
        size: 'lg',
        beforeDismiss: async () => {
          if (this.isAuthorized) {
            if (modalRef.componentInstance.isChanged
              || modalRef.componentInstance.mLotNumber !== ''
              || modalRef.componentInstance.mPacked !== 0) {
                let shouldExit: boolean;
                await Swal.fire({
                  title: 'Confirm Exit?',
                  showCancelButton: true,
                  text: 'You will lose unsaved changes',
                  icon: 'warning',
                  confirmButtonText: 'Yes',
                  cancelButtonText: 'No'
                }).then((exit) => {
                  shouldExit = exit.isConfirmed;
                });
                return shouldExit;
            }
          }
        }
      });
    modalRef.componentInstance.selectedActivityIndex = index;
    modalRef.componentInstance.in_activity = this.activities[index];
    modalRef.componentInstance._isAuthorized = this.isAuthorized;
    modalRef.componentInstance.userType = ( this.activeUser ? this.activeUser.USER_TYPE : 0 );
  }

  openDowntimeModal(event, index) {
    const modalRef = this.modalService.open(ActivityDowntimeComponent,
      {
        size: 'lg',
        beforeDismiss: async () => {
          if (this.isAuthorized) {
            if (modalRef.componentInstance.isChanged
              || modalRef.componentInstance.mMinutes !== 0
              || modalRef.componentInstance.mQuantity !== 0
              || modalRef.componentInstance.mRemarks !== '') {
                let shouldExit: boolean;
                await Swal.fire({
                  title: 'Confirm Exit?',
                  showCancelButton: true,
                  text: 'You will lose unsaved changes',
                  icon: 'warning',
                  confirmButtonText: 'Yes',
                  cancelButtonText: 'No'
                }).then((exit) => {
                  shouldExit = exit.isConfirmed;
                });
                return shouldExit;
            }
          }
        }
      });
    modalRef.componentInstance.activity = this.activities[index];
    modalRef.componentInstance.downtimeTypes = this.downtimeTypes;
    modalRef.componentInstance._isAuthorized = this.isAuthorized;
    modalRef.componentInstance.selectedActivityIndex = index;
    modalRef.componentInstance.userType = ( this.activeUser ? this.activeUser.USER_TYPE : 0 );
    // modalRef.componentInstance.userType = ( this.activeUser ? this.activeUser.USER_TYPE : 0 );
    event.stopPropagation();
  }

  detectChange() {
    this.cdr.detectChanges();
  }

  addRow() {
    const modalRef = this.modalService.open(AddRowComponent, {size: 'md'});
    modalRef.componentInstance.actualStart = this.headerObj.ACTUAL_START;
  }

  isSameDay(index: number): boolean {
    const prevDate = moment(this.activities[index - 1].START_TIME);
    const actDate = moment(this.activities[index].START_TIME);
    if (prevDate.isSame(actDate, 'day')) {
      return true;
    }
    return false;
  }

  addEndProdRow() {
    if (this.headerObj.STATUS === 1) {
      // this.isToEndProd = true;
      this.lastActivity = this.activities[0];
      this.activityService.addEndProdRow();
    }
  }

  removeEndProdRow() {
    if (this.headerObj.STATUS === 1) {
        this.activityService.removeEndProdRow();
        // this.isToEndProd = false;
    }
  }

  get isNewTimeAfter(): boolean {
    let res = false;
    if (this.activities.length && this.lastActivity) {
      if (moment(this.servertime).isAfter(moment(this.lastActivity.END_TIME))) {
        res = true;
      }
    }
    return res;
  }

  get totalStdOutput(): number {
    let res = 0;
    if (this.activities.length && this.headerObj.STD_OUTPUT) {
      res = (this.activities.length * this.headerObj.STD_OUTPUT);
    }
    return res;
  }

  get stdOutputPerMinute(): number {
    return Math.floor(this.totalStdOutput / 60);
  }
  get efficiency(): number {
    let res = 0;
    if (this.totalStdOutput) {
      res = (this.outputPerMinuteSubtotal / this.stdOutputPerMinute) * 100;
    }
    return res;
  }
}
