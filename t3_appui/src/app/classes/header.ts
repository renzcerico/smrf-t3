import { ServertimeService } from './../services/servertime.service';
import * as moment from 'moment';
export default class Header {
    ID: number;
    BARCODE: string;
    ACTUAL_START: string;
    ACTUAL_END: string;
    STATUS: number;
    PO_NUMBER: string;
    CONTROL_NUMBER: string;
    SHIPPING_DATE: string;
    ORDER_QUANTITY: number;
    CUSTOMER: string;
    CUSTOMER_CODE: string;
    CUSTOMER_SPEC: string;
    OLD_CODE: string;
    INTERNAL_CODE: string;
    PRODUCT_DESCRIPTION: string;
    SHIFT: string;
    SCHEDULE_DATE_START: string;
    SCHEDULE_DATE_END: string;
    IS_NEW: number;
    IS_CHANGED: number;
    FORWARDED_BY: number;
    REVIEWED_BY: number;
    APPROVED_BY: number;
    REVIEWED_AT: string;
    APPROVED_AT: string;
    FORWARDED_AT: string;
    MFG_DATE: string;
    servertime: any;
    shifts: Array<any> = [];
    GRP_NUM: string;
    STD_OUTPUT: number;
    dayshift = 'dayshift';
    nightshift = 'nightshift';

    constructor(jsonObj, private servertimeService: ServertimeService) {
        servertimeService.time$.subscribe(
            datetime => {
                this.servertime = moment(datetime).format('DD-MMM-YYYY HH:mm:ss');
            }
        );

        this.ID = jsonObj.ID || null;
        this.BARCODE = jsonObj.BARCODE || (jsonObj.HEADER_ID ? jsonObj.HEADER_ID.toString() : '') || '';
        this.ACTUAL_START = (jsonObj.ACTUAL_START ? moment(jsonObj.ACTUAL_START ).format('DD-MMM-YYYY HH:mm:ss') : this.servertime );


        let dateString = moment(this.ACTUAL_START).format('MM/DD/YYYY');
        const breakPoint = moment(dateString + ' 00:00');
        const breakPoin1 = moment(dateString + ' 08:00');

        if (moment(this.ACTUAL_START).isBetween(breakPoint, breakPoin1)) {
            dateString = moment(dateString).subtract(1, 'day').format('MM/DD/YYYY');
        }

        this.shifts[this.nightshift] = {
            first_hour: moment(dateString + ' 19:00', 'MM/DD/YYYY HH:mm'),
            breaktime_start: moment(moment(dateString).add(1, 'day').format('MM/DD/YYYY') + ' 00:00', 'MM/DD/YYYY HH:mm'),
            breaktime_end: moment(moment(dateString).add(1, 'day').format('MM/DD/YYYY') + ' 01:00', 'MM/DD/YYYY HH:mm'),
            allowed_schedule_start: [dateString, moment(dateString).add(1, 'day').format('MM/DD/YYYY')]
        };

        this.shifts[this.dayshift] = {
          first_hour: moment(dateString + ' 08:00', 'MM/DD/YYYY HH:mm'),
          breaktime_start: moment(dateString + ' 12:00', 'MM/DD/YYYY HH:mm'),
          breaktime_end: moment(dateString + ' 13:00', 'MM/DD/YYYY HH:mm'),
          allowed_schedule_start: [dateString]
        };

        this.ACTUAL_END = (jsonObj.ACTUAL_END ? moment(jsonObj.ACTUAL_END ).format('DD-MMM-YYYY HH:mm:ss') : '' ) || '';
        this.STATUS = jsonObj.STATUS || 1;
        this.PO_NUMBER = jsonObj.PO_NUMBER || jsonObj.CUST_PO_NUMBER || '';
        this.CONTROL_NUMBER = jsonObj.CONTROL_NUMBER || (jsonObj.HEADER_ID ? jsonObj.HEADER_ID.toString() : '') || '';
        this.SHIPPING_DATE = jsonObj.SHIPPING_DATE || '';
        this.ORDER_QUANTITY = jsonObj.ORDER_QUANTITY || 0;
        this.CUSTOMER = jsonObj.CUSTOMER || jsonObj.CUST_ALIAS || '';
        this.CUSTOMER_CODE = jsonObj.CUSTOMER_CODE || jsonObj.CUSTOMER_ITEM_CODE || '';
        this.CUSTOMER_SPEC = jsonObj.CUSTOMER_SPEC || jsonObj.CUSTOMER_ITEM_DESC || '';
        this.OLD_CODE = jsonObj.OLD_CODE || jsonObj.PRODUCT_CODE_OLD || '';
        this.INTERNAL_CODE = jsonObj.INTERNAL_CODE || jsonObj.PRODUCT_CODE || '';
        this.PRODUCT_DESCRIPTION = jsonObj.PRODUCT_DESCRIPTION || jsonObj.PRODUCT_DESC || '';

        if (jsonObj.SHIFT) {
            this.SHIFT = jsonObj.SHIFT;
        } else {
            if (moment(this.ACTUAL_START).isBetween(this.shifts[this.dayshift].first_hour, this.shifts[this.nightshift].first_hour)) {
                this.SHIFT = 'dayshift';
            } else {
                this.SHIFT = 'nightshift';
            }
        }

        if (jsonObj.SCHEDULE_DATE_START) {
            this.SCHEDULE_DATE_START = moment(jsonObj.SCHEDULE_DATE_START).format('YYYY-MM-DD');
        } else {
            this.SCHEDULE_DATE_START = moment(this.servertime).format('YYYY-MM-DD');
            if (this.SHIFT === 'nightshift') {
                if (
                    moment(this.ACTUAL_START).isBetween(this.shifts[this.nightshift].breaktime_start, this.shifts[this.dayshift].first_hour)
                ) {
                    this.SCHEDULE_DATE_START = moment(this.servertime).subtract(1, 'day').format('YYYY-MM-DD');
                }
            }
        }

        // this.SCHEDULE_DATE_START = jsonObj.SCHEDULE_DATE_START || '';
        this.SCHEDULE_DATE_END = jsonObj.SCHEDULE_DATE_END || '';
        this.FORWARDED_BY = jsonObj.FORWARDED_BY || null;
        this.REVIEWED_BY = jsonObj.REVIEWED_BY || null;
        this.APPROVED_BY = jsonObj.APPROVED_BY || null;
        this.REVIEWED_AT = (jsonObj.REVIEWED_AT ? moment(jsonObj.REVIEWED_AT ).format('DD-MMM-YYYY HH:mm:ss') : '') || '';
        this.APPROVED_AT = (jsonObj.APPROVED_AT ? moment(jsonObj.APPROVED_AT ).format('DD-MMM-YYYY HH:mm:ss') : '') || '';
        this.FORWARDED_AT = (jsonObj.FORWARDED_AT ? moment(jsonObj.FORWARDED_AT ).format('DD-MMM-YYYY HH:mm:ss') : '') || '';
        (jsonObj.IS_NEW === 0 ? this.IS_NEW = 0 : this.IS_NEW = 1);
        (jsonObj.IS_CHANGED === 0 ? this.IS_CHANGED = 0 : this.IS_CHANGED = 1);
        this.GRP_NUM = jsonObj.GRP_NUM || 'fp-01';
        this.STD_OUTPUT = jsonObj.STD_OUTPUT || 0;
    }

    isScheduleDateValid(): boolean {
        let res = true;
        // tslint:disable-next-line: max-line-length
        const allowed = this.shifts[this.SHIFT].allowed_schedule_start.find( el => moment(el).isSame(moment(this.SCHEDULE_DATE_START), 'day'));
        if (!allowed) {
            res = false;
        }
        return res;
    }

    isShiftValid(): boolean {
        let res = true;
        let start;
        let end;
        if (this.SHIFT === 'nightshift') {
            start = moment(this.shifts[this.nightshift].first_hour);
            end = moment(this.shifts[this.dayshift].first_hour);
        } else {
            start = moment(this.shifts[this.dayshift].first_hour);
            end = moment(this.shifts[this.nightshift].first_hour);
        }
        res = moment(this.ACTUAL_START).isBetween(start, end);
        return res;
    }

    getJson() {
        const obj = {
            ID: this.ID,
            BARCODE: this.BARCODE,
            ACTUAL_START: this.ACTUAL_START,
            ACTUAL_END: this.ACTUAL_END,
            STATUS: this.STATUS,
            PO_NUMBER: this.PO_NUMBER,
            CONTROL_NUMBER: this.CONTROL_NUMBER,
            SHIPPING_DATE: this.SHIPPING_DATE,
            ORDER_QUANTITY: this.ORDER_QUANTITY,
            CUSTOMER: this.CUSTOMER,
            CUSTOMER_CODE: this.CUSTOMER_CODE,
            CUSTOMER_SPEC: this.CUSTOMER_SPEC,
            OLD_CODE: this.OLD_CODE,
            INTERNAL_CODE: this.INTERNAL_CODE,
            PRODUCT_DESCRIPTION: this.PRODUCT_DESCRIPTION,
            SHIFT: this.SHIFT,
            SCHEDULE_DATE_START: moment(this.SCHEDULE_DATE_START).format('DD-MMM-YYYY HH:mm:ss'),
            SCHEDULE_DATE_END: this.SCHEDULE_DATE_END,
            FORWARDED_BY: this.FORWARDED_BY,
            REVIEWED_BY: this.REVIEWED_BY,
            APPROVED_BY: this.APPROVED_BY,
            REVIEWED_AT: this.REVIEWED_AT,
            APPROVED_AT: this.APPROVED_AT,
            FORWARDED_AT: this.FORWARDED_AT,
            IS_CHANGED: this.IS_CHANGED,
            IS_NEW: this.IS_NEW,
            MFG_DATE: moment(this.MFG_DATE).format('DD-MMM-YYYY HH:mm:ss'),
            GRP_NUM: this.GRP_NUM
        };
        return obj;
    }
 }
