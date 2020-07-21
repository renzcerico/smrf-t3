import { DialogData } from './../department/department.component';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-services-dialog',
  templateUrl: './services-dialog.component.html',
  styleUrls: ['./services-dialog.component.css']
})
export class ServicesDialogComponent implements OnInit {
  servicesID: number;
  servicesCode: string;
  servicesName: string;
  servicesDepartment: number;
  representativeDepartment: Array<any> = [];

  constructor(public http: HttpClient,@Inject(MAT_DIALOG_DATA)  public data: DialogData) { }

  ngOnInit() {
    this.servicesID = this.data.id;
    this.getServicesDetails();
    this.getRepresentativeDepartments();
  }

  getRepresentativeDepartments() {
    this.http.get('/localapi/service-representatives')
      .subscribe(
        res => {
          const data: any = res;

          for (let i = 0; i < data.length; i++) {
            const representative = {
                id: data[i].REP_ID,
                department: data[i].REP_NAME
            };

            this.representativeDepartment.push(representative);
          }

        },
        err => {
          console.log(err);
        }
      );
  }

  submitServices() {
      if (this.servicesID) {
        // Update services
        this.updateServices();
        return;
      }

      // Add services
      this.addServices();
  }

  addServices() {
    const services = {
      services_code: this.servicesCode,
      services_name: this.servicesName,
      services_deparment: this.servicesDepartment
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

  updateServices() {
    const services = {
      services_code: this.servicesCode,
      services_name: this.servicesName,
      services_deparment: this.servicesDepartment
    };

    this.http.post('/localapi/services/' + this.servicesID, services)
        .subscribe(
            res => {
              console.log(res);
            },
            err => {
              console.log(err);
            }
        );
  }

  getServicesDetails() {
      if (this.servicesID) {
        this.http.get('/localapi/services/' + this.servicesID)
            .subscribe(
                res => {
                    this.servicesCode = res[0].SR_TYPE_CODE;
                    this.servicesName = res[0].SR_TYPE_NAME;
                    this.servicesDepartment = res[0].REP_ID;
                },
                err => {
                  console.log(err);
                }
            );
      }
  }

}
