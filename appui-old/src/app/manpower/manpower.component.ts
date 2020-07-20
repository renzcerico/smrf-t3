import { UserService } from './../user.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-manpower',
  templateUrl: './manpower.component.html',
  styleUrls: ['./manpower.component.css']
})
export class ManpowerComponent implements OnInit {
  manpower;
  jobManpower = 0;

  @Output()
  manpowerId: EventEmitter<string> = new EventEmitter<string>();

  constructor(public http: HttpClient, public userService: UserService) { }

  ngOnInit() {
    this.getManpower();
  }

  getManpower() {
    let url;
    // url = 'http://t2apps.tailinsubic.com/api/personnel/ ';
    url = '/localapi/users/dept/' + this.userService.user.department;

    this.http.get(url)
             .subscribe(
                res => {
                  this.manpower = res;
                  this.manpower.sort();
                },
                err => {
                  console.log(err);
                }
             );
  }

  setManpower(id) {
    this.manpowerId.emit(id);
  }

}
