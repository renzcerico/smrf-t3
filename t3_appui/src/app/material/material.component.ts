import { Component, OnInit, AfterContentChecked, ViewChildren, ElementRef, QueryList, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-material',
    templateUrl: './material.component.html',
    styleUrls: ['./material.component.css']
})

export class MaterialComponent implements OnInit, AfterContentChecked {
    @ViewChildren('tdEditable') tdEditable !: QueryList<ElementRef>;
    @Input() actTotal: number;
    @Input() materials = [];
    activeUser;
    userID;
    userType: number;
    apiResponse: any;
    isAuthorized: boolean;

    constructor(public apis: ApiService,
                private userService: UserService) {
        this.userService.user.subscribe(
          res => {
            if (res) {
              this.activeUser = res;
            }
          },
            err => {
            console.log(err);
          }
        );
    }

    ngOnInit() {
    }

    ngAfterContentChecked() {
      (this.activeUser ? this.isAuthorized = this.activeUser.IS_AUTHORIZED : this.isAuthorized = false);
    }

    valueChanged(index: number, field: string = '') {
        if (field === 'reject' && this.materials[index].REJECT < 0) {
            Swal.fire({
                title: 'Warning',
                text: 'Invalid Value',
                icon: 'warning',
                confirmButtonText: 'OK',
            }).then( val => {
                this.materials[index].REJECT = 0;
            });
        } else {
            this.materials[index].IS_CHANGED = 1;
        }
    }

    makeApiCallGET() {
        this.apis.getHeader()
        .subscribe(
            d => {
                this.apiResponse = d;
            },
            e => {
                this.apiResponse = e;
                console.log('No response ' + e);
            }
        );
    }

    onKeyDown(event) {
        const elArr = this.tdEditable.toArray();
        const activeIndex = elArr.findIndex( indexFilter => {
            return (indexFilter.nativeElement.parentElement === event.srcElement.parentElement);
        });

        if (activeIndex < elArr.length - 1) {
            elArr[activeIndex + 1].nativeElement.focus();
        } else {
            elArr[activeIndex].nativeElement.blur();
        }

        event.preventDefault();
    }
}
