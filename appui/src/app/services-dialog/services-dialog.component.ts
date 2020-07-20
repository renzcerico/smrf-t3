import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services-dialog',
  templateUrl: './services-dialog.component.html',
  styleUrls: ['./services-dialog.component.css']
})
export class ServicesDialogComponent implements OnInit {
  serviceCode: string;
  serviceName: string;
  serviceDepartment: number;

  constructor(public http: HttpClient) { }

  ngOnInit(): void {
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
