export default class Material {
    ID:	number;
    QUANTITY:	number;
    STANDARD:	number;
    REQUIREMENTS:	number;
    USED:	number;
    REJECT:	number;
    REMARKS:	string;
    LAST_UPDATED_BY:	number;
    DATE_ENTERED:	string;
    DATE_UPDATED:	string;
    MATERIAL_CODE:	string;
    MATERIAL_DESC:	string;
    LAST_UPDATED_BY_NAME:	string;
    HEADER_ID:	number;
    ITEM_CATEGORY: string;
    BOX_TYPE: string;
    MAX_QTY: number;
    IS_NEW: number;
    IS_CHANGED: number;

    constructor(jsonObj) {
        this.ID = jsonObj.ID || null;
        this.QUANTITY = jsonObj.QUANTITY || jsonObj.STD_QTY || null;
        this.STANDARD = jsonObj.STANDARD || jsonObj.STD_QTY || null;
        this.REQUIREMENTS = jsonObj.REQUIREMENTS || jsonObj.REQUIRE_QTY || null;
        this.USED = jsonObj.USED || 0;
        this.REJECT = jsonObj.REJECT || 0;
        this.REMARKS = jsonObj.REMARKS || '';
        this.LAST_UPDATED_BY = jsonObj.LAST_UPDATED_BY || 0;
        this.DATE_ENTERED = jsonObj.DATE_ENTERED || '';
        this.DATE_UPDATED = jsonObj.DATE_UPDATED || '';
        this.LAST_UPDATED_BY_NAME = jsonObj.LAST_UPDATED_BY_NAME || '';
        this.MATERIAL_CODE = jsonObj.MATERIAL_CODE || jsonObj.ITEM_CODE || '';
        this.MATERIAL_DESC = jsonObj.MATERIAL_DESC || jsonObj.ITEM_DESC || '';
        this.HEADER_ID = jsonObj.HEADER_ID || null;
        this.ITEM_CATEGORY = jsonObj.ITEM_CATEGORY || null;
        this.BOX_TYPE = jsonObj.BOX_TYPE || null;
        this.MAX_QTY = jsonObj.MAX_QTY || null;
        (jsonObj.IS_NEW === 0 ? this.IS_NEW = 0 : this.IS_NEW = 1);
        (jsonObj.IS_CHANGED === 0 ? this.IS_CHANGED = 0 : this.IS_CHANGED = 1);
    }
}
