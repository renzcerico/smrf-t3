import { HttpClient } from '@angular/common/http';
import { UserService } from './../user.service';
import { Component, OnInit, Injectable, Input } from '@angular/core';
// import { recipient } from './../recipient';

@Component({
  selector: 'app-recipient',
  templateUrl: './recipient.component.html',
  styleUrls: ['./recipient.component.css', '../requests/request/request.component.css']
})

@Injectable({
  providedIn: 'root',
})
export class RecipientComponent implements OnInit {
  @Input() recipientID;

  recipient: any = [];

  constructor(public userService: UserService, public http: HttpClient) { }

  async ngOnInit() {
    await this.getAllRecipient();
  }

  selectRecipient(val) {
    this.recipientID = val;
    this.userService.recipient = this.recipientID;
  }

  getRecipient() {
    return this.recipientID;
  }

  async getAllRecipient() {
    const url = '/localapi/approver/' + this.userService.user.department;

    await this.http.get(url)
          .subscribe(
            res => {
              this.recipient = res;
            },
            err => {
              console.log(err);
            }
          );
  }

}
