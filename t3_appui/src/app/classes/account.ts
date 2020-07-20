import { HeaderFactory } from './header-factory';
import Header from './header';
import { HeaderService } from './../services/header.service';

export default class Account {
    ID: number;
    FIRST_NAME: string;
    MIDDLE_NAME: string;
    LAST_NAME: string;
    GENDER: string;
    USER_LEVEL: string;
    CREATED_AT: string;
    USERNAME: string;
    // headerObj: Header;
    userTypes = {
        user        : 1,
        supervisor  : 2,
        manager     : 3,
        admin       : 4
    };
    _IS_AUTHORIZED;
    constructor(jsonObj: any, public headerService: HeaderService, private headerFactory: HeaderFactory) {
        this.ID          = jsonObj.ID || null;
        this.FIRST_NAME  = jsonObj.FIRST_NAME || '';
        this.MIDDLE_NAME = jsonObj.MIDDLE_NAME || '';
        this.LAST_NAME   = jsonObj.LAST_NAME || '';
        this.GENDER      = jsonObj.GENDER || '';
        this.USER_LEVEL  = jsonObj.USER_LEVEL || '';
        this.CREATED_AT  = jsonObj.CREATED_AT || '';
        this.USERNAME    = jsonObj.USERNAME || '';
        headerService.header$.subscribe(
            data => {
              const headerObj = this.headerFactory.setHeader(data.header_obj);
              this.IS_AUTHORIZED = headerObj;
            }
        );
    }

    get USER_TYPE() {
        return this.userTypes[this.USER_LEVEL.toLowerCase()];
    }

    get IS_AUTHORIZED() {
        return this._IS_AUTHORIZED;
    }

    set IS_AUTHORIZED(headerObj: Header) {
        if (headerObj) {
            if (headerObj.STATUS > this.USER_TYPE) {
                this._IS_AUTHORIZED = false;
            } else if (headerObj.STATUS < this.USER_TYPE) {
                this._IS_AUTHORIZED = true;
            } else {
                switch (headerObj.STATUS) {
                    case 1:
                        this._IS_AUTHORIZED = true;
                        break;
                    case 2:
                        if (headerObj.REVIEWED_BY === this.ID) {
                            this._IS_AUTHORIZED = true;
                        } else {
                            this._IS_AUTHORIZED = false;
                        }
                        break;
                    case 3:
                        if (headerObj.APPROVED_BY === this.ID) {
                            this._IS_AUTHORIZED = true;
                        } else {
                            this._IS_AUTHORIZED = false;
                        }
                        break;
                    default:
                        this._IS_AUTHORIZED = false;
                        break;
                }
            }
            // return false;
        } else {
            this._IS_AUTHORIZED = false;
        }
    }
}
