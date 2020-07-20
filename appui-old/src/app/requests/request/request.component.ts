import { RequestService } from '../../request-service.service';
import { RequestFormComponent } from '../request-form/request-form.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipientComponent } from '../../recipient/recipient.component';
import { requestList } from '../../request-list';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  requestType = 'request';

  constructor(private recipient: RecipientComponent) { }

  ngOnInit() {
  }

}
