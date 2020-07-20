export default class ActivityDetails {
    ID: number;
    LOT_NUMBER: string;
    ACTIVITY_ID: number;
    PACKED_QTY: number;
    ADJ_QTY: number;
    constructor(jsonObj) {
        this.ID = jsonObj.ID || null;
        this.ACTIVITY_ID = jsonObj.ACTIVITY_ID || null;
        this.LOT_NUMBER = jsonObj.LOT_NUMBER || '';
        this.PACKED_QTY = jsonObj.PACKED_QTY || 0;
        this.ADJ_QTY = jsonObj.ADJ_QTY || 0;
    }
}
