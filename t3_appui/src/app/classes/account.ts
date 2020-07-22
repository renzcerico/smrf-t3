import { ManpowerService } from './../services/manpower.service';
import { HeaderFactory } from './header-factory';
import Header from './header';
import { HeaderService } from './../services/header.service';
import Manpower from './manpower';

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
    headerObj: Header;
    manpower: Manpower;
    manpowers: Array<Manpower>;
    constructor(jsonObj: any,
                public headerService: HeaderService,
                private headerFactory: HeaderFactory,
                private manpowerService: ManpowerService) {

        this.ID          = jsonObj.ID || null;
        this.FIRST_NAME  = jsonObj.FIRST_NAME || '';
        this.MIDDLE_NAME = jsonObj.MIDDLE_NAME || '';
        this.LAST_NAME   = jsonObj.LAST_NAME || '';
        this.GENDER      = jsonObj.GENDER || '';
        this.USER_LEVEL  = jsonObj.USER_LEVEL || '';
        this.CREATED_AT  = jsonObj.CREATED_AT || '';
        this.USERNAME    = jsonObj.USERNAME || '';
    }

    get USER_TYPE() {
        return this.userTypes[this.USER_LEVEL.toLowerCase()];
    }
}
