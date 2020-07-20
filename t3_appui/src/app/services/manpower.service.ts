import { ServertimeService } from './servertime.service';
import { Injectable } from '@angular/core';
import { Manpower } from '../classes/manpower';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ManpowerService {
  private manpowerSource = new Subject<Array<Manpower>>();
  manpower$ = this.manpowerSource.asObservable();
  manpowers: Array<Manpower> = [];
  defaultManpower = [
    { ID: null,
      POSITION_ID     : 1,
      MANPOWER_ID     : null,
      START_TIME      : '',
      END_TIME        : '',
      REMARKS         : '',
      LAST_UPDATED_BY : null,
      DATE_ENTERED    : '',
      DATE_UPDATED    : '',
      HEADER_ID       : null
    },
    { ID: null,
      POSITION_ID     : 2,
      MANPOWER_ID     : null,
      START_TIME      : '',
      END_TIME        : '',
      REMARKS         : '',
      LAST_UPDATED_BY : null,
      DATE_ENTERED    : '',
      DATE_UPDATED    : '',
      HEADER_ID       : null
    },
    { ID: null,
      POSITION_ID     : 3,
      MANPOWER_ID     : null,
      START_TIME      : '',
      END_TIME        : '',
      REMARKS         : '',
      LAST_UPDATED_BY : null,
      DATE_ENTERED    : '',
      DATE_UPDATED    : '',
      HEADER_ID       : null
    },
    { ID: null,
      POSITION_ID     : 4,
      MANPOWER_ID     : null,
      START_TIME      : '',
      END_TIME        : '',
      REMARKS         : '',
      LAST_UPDATED_BY : null,
      DATE_ENTERED    : '',
      DATE_UPDATED    : '',
      HEADER_ID       : null
    },
    { ID: null,
      POSITION_ID     : 5,
      MANPOWER_ID     : null,
      START_TIME      : '',
      END_TIME        : '',
      REMARKS         : '',
      LAST_UPDATED_BY : null,
      DATE_ENTERED    : '',
      DATE_UPDATED    : '',
      HEADER_ID       : null
    },
    { ID: null,
      POSITION_ID     : 6,
      MANPOWER_ID     : null,
      START_TIME      : '',
      END_TIME        : '',
      REMARKS         : '',
      LAST_UPDATED_BY : null,
      DATE_ENTERED    : '',
      DATE_UPDATED    : '',
      HEADER_ID       : null
    },
    { ID: null,
      POSITION_ID     : 7,
      MANPOWER_ID     : null,
      START_TIME      : '',
      END_TIME        : '',
      REMARKS         : '',
      LAST_UPDATED_BY : null,
      DATE_ENTERED    : '',
      DATE_UPDATED    : '',
      HEADER_ID       : null
    },
  ];
  servertime: string;
  constructor(private servertimeService: ServertimeService) {
    servertimeService.time$.subscribe(
      datetime => {
          this.servertime = moment(datetime).format('DD-MMM-YYYY HH:mm:ss');
      }
    );
    this.manpower$.subscribe(
      manpowers => {
        this.manpowers = manpowers;
      }
    );
  }

  setManpower(manpower: Array<any> = []) {
    const manpowerArr = [];
    let manpowerObj;
    this.defaultManpower.forEach(el => {
      const actualManpower = manpower.filter(e => e.POSITION_ID === el.POSITION_ID);
      if (actualManpower.length > 0) {
        manpowerObj = new Manpower(actualManpower[0]);
      } else {
        el.DATE_ENTERED = this.servertime;
        el.DATE_UPDATED = this.servertime;
        manpowerObj = new Manpower(el);
      }
      manpowerArr.push(manpowerObj);
    });
    this.manpowerSource.next(manpowerArr);
  }

}
