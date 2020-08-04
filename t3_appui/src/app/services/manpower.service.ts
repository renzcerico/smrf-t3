import { ApiService } from './api.service';
// import { UserService } from './user.service';
import { ServertimeService } from './servertime.service';
import { Injectable } from '@angular/core';
import Manpower from '../classes/manpower';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ManpowerService {
  private manpowerSource = new Subject<Array<Manpower>>();
  manpower$ = this.manpowerSource.asObservable();
  manpowers: Array<Manpower> = [];
  defaultManpower: Array<any> = [];
//   defaultManpower = [
//     { ID: null,
//       POSITION_ID     : 1,
//       MANPOWER_ID     : null,
//       START_TIME      : '',
//       END_TIME        : '',
//       REMARKS         : '',
//       LAST_UPDATED_BY : null,
//       DATE_ENTERED    : '',
//       DATE_UPDATED    : '',
//       HEADER_ID       : null
//     },
//     { ID: null,
//       POSITION_ID     : 2,
//       MANPOWER_ID     : null,
//       START_TIME      : '',
//       END_TIME        : '',
//       REMARKS         : '',
//       LAST_UPDATED_BY : null,
//       DATE_ENTERED    : '',
//       DATE_UPDATED    : '',
//       HEADER_ID       : null
//     },
//     { ID: null,
//       POSITION_ID     : 3,
//       MANPOWER_ID     : null,
//       START_TIME      : '',
//       END_TIME        : '',
//       REMARKS         : '',
//       LAST_UPDATED_BY : null,
//       DATE_ENTERED    : '',
//       DATE_UPDATED    : '',
//       HEADER_ID       : null
//     },
//     { ID: null,
//       POSITION_ID     : 4,
//       MANPOWER_ID     : null,
//       START_TIME      : '',
//       END_TIME        : '',
//       REMARKS         : '',
//       LAST_UPDATED_BY : null,
//       DATE_ENTERED    : '',
//       DATE_UPDATED    : '',
//       HEADER_ID       : null
//     },
//     { ID: null,
//         POSITION_ID     : 5,
//         MANPOWER_ID     : null,
//         START_TIME      : '',
//         END_TIME        : '',
//         REMARKS         : '',
//         LAST_UPDATED_BY : null,
//         DATE_ENTERED    : '',
//         DATE_UPDATED    : '',
//         HEADER_ID       : null
//       }
//   ];
  servertime: string;
  activeUser: any;
  constructor(private servertimeService: ServertimeService, private apis: ApiService) {
    this.apis.getAllPositions().toPromise().then(res => {
        this.defaultManpower = res;
    });
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
    let manpowerObj: Manpower;
    this.defaultManpower.forEach(el => {
      const actualManpower = manpower.filter(e => e.POSITION_ID === el.ID);
      if (actualManpower.length > 0) {
        manpowerObj = new Manpower(actualManpower[0]);
      } else {
        // if (el.POSITION_ID === 2) {
        //   el.MANPOWER_ID = this.activeUser.ID;
        // }
        const empytManpower = new Manpower({
            POSITION_ID: el.ID,
            DATE_ENTERED: this.servertime,
            DATE_UPDATED: this.servertime,
        });
        manpowerObj = new Manpower(empytManpower);
      }
      manpowerArr.push(manpowerObj);
    });
    this.manpowerSource.next(manpowerArr);
  }

  deleteManpower() {
    this.manpowerSource.next([]);
  }

}
