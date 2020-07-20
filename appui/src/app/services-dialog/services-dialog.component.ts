import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

// export interface Representative {
//   id: number;
//   department: string;
// }
@Component({
  selector: 'app-services-dialog',
  templateUrl: './services-dialog.component.html',
  styleUrls: ['./services-dialog.component.css']
})
export class ServicesDialogComponent implements OnInit {
  serviceCode: string;
  serviceName: string;
  serviceDepartment: number;
  representativeDepartment: Array<any> = [];

  constructor(public http: HttpClient) { }

  async ngOnInit() {
    await this.getRepresentativeDepartments();
  }

  getRepresentativeDepartments() {
    this.http.get('/localapi/service-representatives')
      .subscribe(
        res => {
          const data: any = res;

          for (let i = 0; i < data.length; i++) {
            const asd = {
              id: data[i].REP_ID,
              department: data[i].REP_NAME
            };

            this.representativeDepartment.push(asd);
          }

        },
        err => {
          console.log(err);
        }
      );
  }

  submitServices() {
    const services = {
      service_code: this.serviceCode,
      service_name: this.serviceName,
      service_deparment: this.serviceDepartment
    };

    this.http.post('/localapi/services', services)
        .subscribe(
            res => {
              console.log(res);
            },
            err => {
              console.log(err);
            }
        );
  }

}
