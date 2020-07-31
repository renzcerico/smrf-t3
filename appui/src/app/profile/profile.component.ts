import { UserService } from './../user.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile = {
    name: 'Loading...',
    username: 'Loading...',
    userLevel: 'Loading...',
    department: 'Loading...'
  };
  response;

  constructor(public user: UserService, public http: HttpClient) {
      this.getProfile();
  }

  ngOnInit() {
  }


  async getProfile() {
      const id = this.user.user.id;

      await this.http.get('/localapi/users/' + id).toPromise()
                .then(
                    res => {
                      this.response = res;

                      if (this.response.length > 0) {
                          this.profile = {
                              name: this.response[0].LAST_NAME + ', ' + this.response[0].FIRST_NAME,
                              username: this.response[0].USERNAME,
                              userLevel: this.response[0].USER_LEVEL,
                              department: this.response[0].DEPARTMENT_NAME
                          };
                          console.log(this.profile);
                      }
                    },
                    err => {
                        console.log(err);
                    }
                );
  }

}
