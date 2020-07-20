import { Inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class AppConfigService  extends BaseService {

    private envUrl = '/localapi/settings';
    private configSettings: any = null;

    get settings() {
        return this.configSettings;
    }

    public load(): Promise<any> {
        return new Promise((resolve, reject) => {
          
        // this.getAPI('/localapi/requests/148').subscribe((response: any) => {
        //     console.log('response from the server 3070:::', response);
        //     // this.configSettings = response;
        //     resolve(true);
        // });

        this.getAPI(this.envUrl).subscribe((response: any) => {
              console.log('response from the server:::', response);
              this.configSettings = response;
              resolve(true);
          });
        });
      }
}
