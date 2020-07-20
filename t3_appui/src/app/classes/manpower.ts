export class Manpower {
    ID: number;
    POSITION_ID: number;
    MANPOWER_ID: number;
    START_TIME: string;
    END_TIME: string;
    REMARKS: string;
    LAST_UPDATED_BY: number;
    DATE_ENTERED: string;
    DATE_UPDATED: string;
    HEADER_ID: number;
    IS_CHANGED: number;
    IS_NEW: number;
    LAST_UPDATED_BY_NAME: string;
    constructor(jsonObj) {
        this.ID = jsonObj.ID || null;
        this.POSITION_ID = jsonObj.POSITION_ID || null;
        this.MANPOWER_ID = jsonObj.MANPOWER_ID || 0;
        this.START_TIME = jsonObj.START_TIME || '';
        this.END_TIME = jsonObj.END_TIME || '';
        this.REMARKS = jsonObj.REMARKS || '';
        this.LAST_UPDATED_BY_NAME = jsonObj.LAST_UPDATED_BY_NAME || '';
        this.LAST_UPDATED_BY = jsonObj.LAST_UPDATED_BY || null;
        this.DATE_ENTERED = jsonObj.DATE_ENTERED || '';
        this.DATE_UPDATED = jsonObj.DATE_UPDATED || '';
        this.HEADER_ID = jsonObj.HEADER_ID || null;
        (jsonObj.IS_NEW === 0 ? this.IS_NEW = 0 : this.IS_NEW = 1);
        (jsonObj.IS_CHANGED === 0 ? this.IS_CHANGED = 0 : this.IS_CHANGED = 1);
    }

    setManpowerID(id: number) {
        this.MANPOWER_ID = id;
    }
}
