import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { requests } from '../../request';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-request-modal',
  templateUrl: './request-modal.component.html',
  styleUrls: ['./request-modal.component.css']
})
export class RequestModalComponent implements OnInit {

  constructor(public userService: UserService, public route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  removeImg() {
    this.userService.srvcRequestAttachment.splice(this.data.index, 1);
  }

}
