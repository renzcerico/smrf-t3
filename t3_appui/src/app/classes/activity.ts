import { MaterialService } from './../services/material.service';
import * as moment from 'moment';
import { ServertimeService } from '../services/servertime.service';

export default class Activity {
    ID: number;
    HEADER_ID: number;
    _START_TIME: any;
    _END_TIME: any;
    LOT_NUMBER: string;
    DOWNTIME: number;
    REMARKS = '';
    LAST_UPDATED_BY: number;
    _DATE_ENTERED: string;
    _DATE_UPDATED: string;
    ACTIVITY_DETAILS: any[];
    ACTIVITY_DOWNTIME: any[];
    LAST_UPDATED_BY_NAME: string;
    IS_NEW: number;
    IS_CHANGED: number;
    servertime: string;
    get PACKED_QTY() {
        let totalPacked = 0;
        this.ACTIVITY_DETAILS.forEach(element => {
          totalPacked += element.PACKED_QTY;
        });
        return totalPacked;
    }
    get ADJ_QTY() {
        let totalAdjustment = 0;
        this.ACTIVITY_DETAILS.forEach(element => {
          totalAdjustment += element.ADJ_QTY;
        });
        return totalAdjustment;
    }
    get TOTAL() {
        return this.ADJ_QTY + this.PACKED_QTY;
    }

    get TOTAL_BOXES() {
        return this.TOTAL / this.materialService.maxBoxQty();
    }
    get TOTAL_DOWNTIME() {
        let totalDowntime = 0;
        this.ACTIVITY_DOWNTIME.forEach(element => {
          totalDowntime += element.MINUTES;
        });
        return totalDowntime;
    }

    set DATE_ENTERED(endTime: any) {
        this._DATE_ENTERED = moment(endTime).format('DD-MMM-YYYY HH:mm:ss');
    }

    get DATE_ENTERED() {
        return this._DATE_ENTERED;
    }

    set DATE_UPDATED(startTime: any) {
        this._DATE_UPDATED = moment(startTime).format('DD-MMM-YYYY HH:mm:ss');
    }

    get DATE_UPDATED() {
        return this._DATE_UPDATED;
    }

    set END_TIME(endTime: any) {
        this._END_TIME = moment(endTime).format('DD-MMM-YYYY HH:mm:ss');
    }

    get END_TIME() {
        return this._END_TIME;
    }

    set START_TIME(startTime: any) {
        this._START_TIME = moment(startTime).format('DD-MMM-YYYY HH:mm:ss');
    }

    get START_TIME() {
        return this._START_TIME;
    }

    constructor(jsonObj, private materialService: MaterialService, private servertimeService: ServertimeService) {
        servertimeService.time$.subscribe(
            datetime => {
                this.servertime = moment(datetime).format('DD-MMM-YYYY HH:mm:ss');
            }
        );

        this.ID = jsonObj.ID || null;
        this.HEADER_ID = jsonObj.HEADER_ID || null;
        this.START_TIME = moment(jsonObj.START_TIME).format() || '';
        this.END_TIME = moment(jsonObj.END_TIME).format() || '';
        this.LOT_NUMBER = jsonObj.LOT_NUMBER || '';
        this.DOWNTIME = jsonObj.DOWNTIME || 0;
        this.REMARKS = jsonObj.REMARKS || '';
        this.LAST_UPDATED_BY_NAME = jsonObj.LAST_UPDATED_BY_NAME || '';
        this.LAST_UPDATED_BY = jsonObj.LAST_UPDATED_BY || 0;
        (jsonObj.DATE_ENTERED ? this.DATE_ENTERED = moment(jsonObj.DATE_ENTERED).format() : this.DATE_ENTERED = this.servertime);
        (jsonObj.DATE_UPDATED ? this.DATE_UPDATED = moment(jsonObj.DATE_UPDATED).format() : this.DATE_UPDATED = this.servertime);
        this.ACTIVITY_DETAILS = jsonObj.ACTIVITY_DETAILS || [];
        this.ACTIVITY_DOWNTIME = jsonObj.ACTIVITY_DOWNTIME || [];
        (jsonObj.IS_NEW === 0 ? this.IS_NEW = 0 : this.IS_NEW = 1);
        (jsonObj.IS_CHANGED === 0 ? this.IS_CHANGED = 0 : this.IS_CHANGED = 1);
    }
    getJson() {
        const json = {
            ID: this.ID,
            HEADER_ID: this.HEADER_ID,
            START_TIME: this.START_TIME,
            END_TIME: this.END_TIME,
            // LOT_NUMBER: this.LOT_NUMBER,
            PACKED_QTY: this.PACKED_QTY,
            ADJ_QTY: this.ADJ_QTY,
            DOWNTIME: this.DOWNTIME,
            REMARKS: this.REMARKS,
            TOTAL: this.TOTAL,
            LAST_UPDATED_BY: this.LAST_UPDATED_BY,
            DATE_ENTERED: this.DATE_ENTERED,
            DATE_UPDATED: this.DATE_UPDATED,
            ACTIVITY_DETAILS: this.ACTIVITY_DETAILS,
            ACTIVITY_DOWNTIME: this.ACTIVITY_DOWNTIME,
            IS_NEW: this.IS_NEW,
            IS_CHANGED: this.IS_CHANGED
        };
        return json;
    }
}
