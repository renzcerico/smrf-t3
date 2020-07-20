import { HeaderFactory } from './../classes/header-factory';
import { ServertimeService } from './servertime.service';
import { ActivityFactory } from './../classes/activity-factory';
import { HeaderService } from './header.service';
import { Injectable} from '@angular/core';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import Activity from '../classes/activity.js';
import { ApiService } from './api.service';
import Header from '../classes/header';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activitiesSource = new Subject<Array<Activity>>();
  private headerSource = new Subject<object>();
  private actualTimeSource = new Subject<object>();
  private downtimeTypeSource = new Subject<Array<object>>();
  activities$ = this.activitiesSource.asObservable();
  header$ = this.headerSource.asObservable();
  actualTime$ = this.actualTimeSource.asObservable();
  downtimeTypes$ = this.downtimeTypeSource.asObservable();
  activities: Array<Activity> = [];
  shifts: Array<any> = [];
  headerObj: any = {};
  downtimeTypes: any = [];
  timer: any;
  servertime: any;

  constructor(
    private apiService: ApiService,
    private headerService: HeaderService,
    private activityFactory: ActivityFactory,
    private headerFactory: HeaderFactory,
    private servertimeService: ServertimeService
  ) {
    const dayshift = 'dayshift';
    const nightshift = 'nightshift';
    const date = new Date();
    const dateString = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    this.shifts[dayshift] = {
      first_hour: moment( dateString + ' 08:00', 'MM/DD/YYYY HH:mm'),
      breaktime_start: moment( dateString + ' 12:00', 'MM/DD/YYYY HH:mm'),
      breaktime_end: moment( dateString + ' 13:00', 'MM/DD/YYYY HH:mm')
    };

    this.shifts[nightshift] = {
      first_hour: moment(dateString + ' 19:00', 'MM/DD/YYYY HH:mm'),
      breaktime_start: moment(dateString + ' 00:00', 'MM/DD/YYYY HH:mm'),
      breaktime_end: moment(dateString + ' 01:00', 'MM/DD/YYYY HH:mm')
    };
    this.activities$.subscribe(
      activities => {
        this.activities = activities;
      }
    );
    headerService.header$.subscribe(
      data => {
        this.headerObj = this.headerFactory.setHeader(data.header_obj).getJson();
      }
    );
    servertimeService.time$.subscribe(
      datetime => {
          this.servertime = moment(datetime);
      }
  );
    this.startTimer();
    this.getDowntimeTypes();
  }

  get expectedTime() {
    let res = { start: null, end: null };
    let start;
    let end;
    if (Object.entries(this.headerObj).length > 0) {
      start = moment(this.headerObj.ACTUAL_START);
      if (
          (
            this.headerObj.SHIFT === 'dayshift' &&
            start.isBefore(this.shifts[this.headerObj.SHIFT].first_hour)
          ) ||
          (
            this.headerObj.SHIFT === 'nightshift' &&
            moment(start).format('A') === 'PM' &&
            start.isBefore(this.shifts[this.headerObj.SHIFT].first_hour )
          )
        ) {
        start = moment(start.format('MM/DD/YYYY') + ' ' + this.shifts[this.headerObj.SHIFT].first_hour.format('HH:mm'));
      }
      if (this.activities.length > 0) {
        start = moment(this.lastActivity.END_TIME);
      }
    }
    end = moment(start).add(1, 'hours').startOf('hour');
    res = {start, end};
    return res;
  }

  get actualTime() {
    let res = {start: null, end: null, exact: null};
    let start = this.servertime.startOf('hour');
    if (Object.entries(this.headerObj).length > 0) {
      if (start.isSame(this.shifts[this.headerObj.SHIFT].breaktime_start)) {
        start = this.shifts[this.headerObj.SHIFT].breaktime_end;
      }
    }
    const end = moment(start).add(1, 'hours');
    const exact = this.servertime;
    res = {start, end, exact};
    this.setActualTime(res);
    return res;
  }

  get lastActivity() {
    let res;
    if (this.activities.length) {
      res = this.activities[0];
    }
    return res;
  }

  getShiftData(shift) {
    return this.shifts[shift];
  }

  setActualTime(actualTime) {
    this.actualTimeSource.next(actualTime);
  }

  setActivities(activities: Array<any>) {
    const activitiesArr = [];
    activities.forEach(element => {
        const activity = this.activityFactory.createActivity(element);
        activitiesArr.push(activity);
    });
    this.activitiesSource.next(activitiesArr);
  }

  logTime() {
    const diff = this.actualTime.start.diff(this.expectedTime.start, 'hours');
  }

  setFillers() {
    let diff = this.actualTime.start.diff(this.expectedTime.start, 'hours');
    if (diff === 0 && !this.activities.length) {
      diff = 1;
    }
    let filler;
    for (let index = 0; index < diff; index++) {
      this.logTime();
      filler = this.activityFactory.createActivity({
        HEADER_ID       : this.headerObj.ID,
        START_TIME      : this.expectedTime.start,
        END_TIME        : this.expectedTime.end,
        IS_NEW          : 1,
      });
      this.activities.unshift(filler);
    }
  }

  startTimer() {
    setInterval(() => {
      if (Object.entries(this.headerObj).length > 0) {
        if (this.headerObj.STATUS === 1) {
          this.setFillers();
        }
      }
    }, 1000);
  }

  async getDowntimeTypes() {
    await this.apiService.getDowntimeTypes().toPromise()
    .then(
        res => {
          res.forEach(element => {
            element.DISABLED = false;
          });
          this.downtimeTypeSource.next(res);
        }
    );
  }

  addCustomActivity(activity: Activity) {
    this.setCustomFillers(activity);
  }

  isActivityAllowed(actStartTime: string) {
    const diff = this.activities.find((activity) => (moment(activity.START_TIME).diff(moment(actStartTime), 'hours') === 0)) || null;
    if (diff) {
      return false;
    } else {
      return true;
    }
  }

  setCustomFillers(activity: Activity) {
    let startAct: Activity;
    let endAct: Activity;
    let isPush: boolean;

    let diff = moment(activity.START_TIME).diff(this.activities[0].START_TIME, 'hours');
    console.log(diff);
    if (diff < 0) {
      startAct = this.activities[this.activities.length - 1];
      endAct = activity;
      diff = moment(startAct.START_TIME).diff(endAct.START_TIME, 'hours');
      console.log(diff);
      isPush = true;
    } else {
      startAct = this.activities[0];
      endAct = activity;
      isPush = false;
    }
    let filler: Activity;
    let start: string;
    let end: string;
    for (let index = 0; index < diff; index++) {
      if (isPush) {
        start = moment(startAct.START_TIME).subtract((index + 1), 'hours').format('DD-MMM-YYYY HH:mm:ss');
        end = moment(start).add(1, 'hours').format('DD-MMM-YYYY HH:mm:ss');
      } else {
        start = moment(startAct.END_TIME).add(index, 'hours').format('DD-MMM-YYYY HH:mm:ss');
        end = moment(start).add(1, 'hours').format('DD-MMM-YYYY HH:mm:ss');
      }
      filler = this.activityFactory.createActivity({
        HEADER_ID       : this.headerObj.ID,
        START_TIME      : start,
        END_TIME        : end,
        IS_NEW          : 1,
      });
      if (isPush) {
        this.activities.push(filler);
      } else {
        this.activities.unshift(filler);
      }
    }
  }

}
