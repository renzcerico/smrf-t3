import Swal from 'sweetalert2';
import { HeaderService } from './../../services/header.service';
import { UserService } from './../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import Header from 'src/app/classes/header';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './../../top-bar/top-bar.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
  });
  username = '';
  apiResponse: any;
  loginHidden = true;
  constructor(  public apis: ApiService,
                private modalService: NgbModal,
                public activeModal: NgbActiveModal,
                public headerService: HeaderService,
                public userService: UserService) {
    }

  ngOnInit() {
  }

  async login() {
    const loginForm = this.loginForm;
    const barcode = document.getElementById('barcode');
    Swal.fire({
      title: 'Logging In...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      onOpen: () => {
        Swal.showLoading();
      }
    });
    await this.apis.loginAPI(loginForm.value).toPromise()
    .then(result => {
      this.apiResponse = result;
      Swal.close();
    }).catch(err => {
      Swal.close();
    });

    if (this.apiResponse) {
      this.username = this.apiResponse.USERNAME;
      this.headerService.getUserForwardList();
      this.userService.setUser(this.apiResponse);
      this.headerService.refreshSource();
      this.headerService.setUpdatedHeaderCountPerStatus('login');
      this.modalService.dismissAll();
      setTimeout(() => {
        barcode.focus();
      }, 100);
    } else {
      this.loginHidden = false;
      setTimeout(() => {
          this.loginHidden = true;
      }, 3000);
    }
    // this.apis.loginAPI(loginForm.value)
    // .subscribe(
    //     result => {
    //         this.apiResponse = result;

    //         if (this.apiResponse) {
    //             this.username = this.apiResponse.USERNAME;
    //             this.userService.setUser(this.apiResponse);
    //             this.headerService.getUserForwardList();

    //             this.modalService.dismissAll();
    //             setTimeout(() => {
    //               barcode.focus();
    //             }, 100);
    //         } else {
    //             this.loginHidden = false;
    //             setTimeout(() => {
    //                 this.loginHidden = true;
    //             }, 3000);
    //         }

    //     },
    //     error => {
    //         this.apiResponse = error;
    //         console.log('No response ' + error);
    //     }
    // );
}

}
