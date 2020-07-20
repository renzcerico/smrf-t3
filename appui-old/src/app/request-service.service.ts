import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  request;
  requestDetails = new BehaviorSubject <string>('');
  serviceRepresentative;
  serviceRepresentativeDetails = new BehaviorSubject <any>('');
  port = '/localapi/';
  reqAll: any;
  reqAllDetails = new BehaviorSubject <any>('');

  constructor(public http: HttpClient) {
      this.requestDetails.next(this.request);
      this.reqAllDetails.next(this.reqAll);
      this.getAllRequest();
  }

  getAllRequest() {
    const url = this.port + 'requests';

    this.http.get(url)
        .subscribe(
            res => {
              this.reqAll = res;
              return this.reqAll;
            },
            err => {
              console.log(err);
            }
        );
  }
}
