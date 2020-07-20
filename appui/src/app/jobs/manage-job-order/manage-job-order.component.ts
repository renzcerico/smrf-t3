import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { requests } from '../../request';
import { RequestSummaryComponent } from '../../requests/request-summary/request-summary.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-job-order',
  templateUrl: './manage-job-order.component.html',
  styleUrls: ['./manage-job-order.component.css']
})
export class ManageJobOrderComponent implements OnInit {
  manpowerList = [];
  requestType = 'details';
  request;
  withJobOrder;

  @ViewChild(RequestSummaryComponent, {static: true}) actComponent;

  constructor(private route: ActivatedRoute, public http: HttpClient) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.request = requests[+params.get('id') - 1];
    });

  }

  ngAfterContentChecked() {
    this.withJobOrder = (this.actComponent.reqStatus > 1);
  }

  ngAfterViewInit() {
    this.withJobOrder = (this.actComponent.reqStatus > 1);
  }

}
