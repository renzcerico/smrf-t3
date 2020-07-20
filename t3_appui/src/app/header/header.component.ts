import { AddRowComponent } from './../modals/add-row/add-row/add-row.component';
import { ServertimeService } from './../services/servertime.service';
import { HeaderFactory } from './../classes/header-factory';
import { ManpowerService } from './../services/manpower.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild, AfterContentChecked, AfterViewInit} from '@angular/core';
import { ApiService } from '../services/api.service';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import ScannerDetector from 'js-scanner-detection';
import * as moment from 'moment';
import { ActivityComponent } from '../activity/activity.component';
import { MaterialComponent } from './../material/material.component';
import { MaterialService } from './../services/material.service';
import {ActivityService} from '../services/activity.service';
import Activity from '../classes/activity';
import Header from '../classes/header';
import { HeaderService } from '../services/header.service';
import { UserService } from './../services/user.service';
import Swal from 'sweetalert2';
import { HeaderModalComponent } from '../header-modal/header-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import * as io from 'socket.io-client';

@Component({
    selector: 'app-home',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css', '../app.component.css']
})

export class HeaderComponent implements OnInit, AfterContentChecked, AfterViewInit {
    [x: string]: any;
    seeResult = 'See more';
    faAngleUp = faAngleUp;
    faAngleDown = faAngleDown;
    iconResult = faAngleDown;
    currentStatus = '';
    currentStatusDesc = '';
    headerObj: any = {};
    actCollection = [];
    matCollection = [];
    manPowercollection = [];
    @ViewChild(ActivityComponent, {static: true}) actComponent;
    @ViewChild(MaterialComponent, {static: true}) matComponent;
    actTotal = 0;
    matArr: any;
    actArr: any = [];
    array: Array<any>;
    prodHover = 0;
    activities: Array<Activity>;
    getDataRes: any = {};
    userType: number;
    activeUser;
    userID;
    usersForwardList;
    isAuthorized: boolean;
    receiverID: number;
    socket;
    url: string;
    timer: any;

    get scheduleTime() {
        let res = '';
        if (Object.entries(this.headerObj).length > 0) {
            res = moment(this.headerObj.SCHEDULE_DATE_START).format('HHmm') + '-' + moment(this.headerObj.SCHEDULE_DATE_END).format('HHmm');
        }
        return res;
    }

    get visibleButton() {
        // user types
        // 1 : manpower
        // 2 : supervisor
        // 3 : manager

        // status
        // 1 : wip
        // 2 : open
        // 3 : completed
        // 4 : closed
        // tslint:disable-next-line: no-inferrable-types
        if ( !this.isAuthorized ) {
            return 'none';
        }
        if ( this.headerObj.STATUS > 3 ) {
            return 'none';
        }
        if (this.userType === 1) {
          if (this.headerObj.STATUS !== 1) {
            return 'none';
          }
          return 'endprod';
        } else if (this.userType === 2) {
          if (this.headerObj.STATUS === 1) {
            return 'endprod';
          } else if (this.headerObj.STATUS === 2) {
            return 'approve';
          }
        } else if (this.userType >= 3) {
          if (this.headerObj.STATUS === 1) {
            return 'endprod';
          } else if (this.headerObj.STATUS > 1) {
            return 'approve';
          }
        }
        return 'none';
      }

    get showSaveButton() {
        return (this.headerObj.STATUS <= this.userType) || this.userType >= 3 && this.headerObj.STATUS < 4;
    }

    apiResponse: any;
    constructor(
        private modalService: NgbModal,
        public apis: ApiService,
        private activityService: ActivityService,
        private headerFactory: HeaderFactory,
        private materialService: MaterialService,
        private manpowerService: ManpowerService,
        private headerService: HeaderService,
        private servertimeService: ServertimeService,
        private userService: UserService) {
        activityService.activities$.subscribe(
            activities => {
              this.actCollection = activities;
            }
          );
        materialService.materials$.subscribe(
            materials => {
                this.matCollection = materials;
            }
        );
        manpowerService.manpower$.subscribe(
            manpower => {
                this.manPowercollection = manpower;
            }
        );
        headerService.header$.subscribe(
            header => {
                this.setData(header);
            }
        );
        this.userService.user$.subscribe(
            res => {
                if (res) {
                    this.activeUser = res;
                }
            },
            err => {
                console.log(err);
            }
        );
        servertimeService.time$.subscribe(
            datetime => {
                this.timer = moment(datetime);
            }
        );
        this.socket = io();
        this.headerService.getUserForwardList();
    }

    ngAfterContentChecked() {
        this.actTotal = this.actComponent.subTotal;
        this.actArr = this.actComponent.activities;
        this.matArr = this.matComponent.materials;
        this.setForwardList();
        if (this.activeUser) {
            this.userType = this.activeUser.USER_TYPE;
            this.isAuthorized = this.activeUser.IS_AUTHORIZED;
        } else {
            this.isAuthorized = false;
        }
    }

    ngAfterViewInit() {
        this.actTotal = this.actComponent.subTotal;
        this.actArr = this.actComponent.activities;
        this.matArr = this.matComponent.materials;
    }

    async ngOnInit() {
        // this.headerService.getData('163178');
        this.barcode();
    }

    btnSee() {
        this.iconResult === faAngleDown ? this.seeLess() : this.seeMore();
    }

    seeMore() {
        this.seeResult = 'See more';
        this.iconResult = faAngleDown;
        const blur = document.querySelector('#blur-container');
        blur.classList.add('blurred-bg');
    }

    seeLess() {
        this.seeResult = 'See less';
        this.iconResult = faAngleUp;
        const blur = document.querySelector('#blur-container');
        blur.classList.remove('blurred-bg');
    }

    barcode() {
        const onComplete = (val) => {
            const barcodeNum = val;
            this.headerService.getData(barcodeNum);
        };

        const options = { onComplete };

        const scannerDetector = new ScannerDetector(options);
    }

    visibleStatus(status) {
        if (status === 'WIP' || status === 1) {
            this.currentStatus = 'dot status-wip';
            this.currentStatusDesc = 'WIP';
        } else if (status === 'OPEN' || status === 2) {
            this.currentStatus = 'dot status-open';
            this.currentStatusDesc = 'OPEN';
        } else if (status === 'COMPLETED' || status === 3) {
            this.currentStatus = 'dot status-completed';
            this.currentStatusDesc = 'COMPLETED';
        } else if (status === 'CLOSED' || status === 4) {
            this.currentStatus = 'dot status-closed';
            this.currentStatusDesc = 'CLOSED';
        }
    }

    handleBarcodeChange(barcode) {
        this.headerService.getData(barcode);
    }

    async header(showConfirmMessage: boolean = true) {
        if (showConfirmMessage) {
            let isConfirmed: boolean;
            await Swal.fire({
                title: 'Confirm',
                showCancelButton: true,
                text: 'Save Transaction?',
                // text: (this.userType > 1 ? 'Do you want to approve another transaction?' : 'Save Transaction?'),
                icon: 'question',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then((confirm) => {
                isConfirmed = confirm.isConfirmed;
            });

            if (!isConfirmed) {
                // if (this.userType > 1) {
                //     const modalRef = this.modalService.open(HeaderModalComponent, { size: 'xl' });
                //     modalRef.componentInstance.status = this.userType;
                //     // modalRef.componentInstance.in_activity = this.activities[index];
                // }
                return;
            }
        }
        Swal.fire({
            title: 'Saving...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            onOpen: () => {
              Swal.showLoading();
            }
          });
        // tslint:disable-next-line: variable-name
        const activity_collection = [];
        this.actCollection.forEach(el => {
            activity_collection.push(el.getJson());
        });
        const json = {
            header_obj          : this.headerObj.getJson(),
            material_collection : this.matCollection,
            manpower_collection : this.manPowercollection,
            user_id             : this.activeUser.ID,
            activity_collection,
        };
        await this.apis.header(json).toPromise()
            .then(
                res => {
                    Swal.close();
                    if (res) {
                        Swal.fire({
                            title: 'Success',
                            text: 'Transaction Saved.',
                            icon: 'success',
                            confirmButtonText: 'Okay',
                        });
                        const emitData = {
                            barcode: json.header_obj.BARCODE,
                            user:   this.activeUser.ID
                        };
                        this.socket.emit('updatedHeader', emitData);
                    }
                },
                err => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error saving transaction.',
                        icon: 'error',
                        confirmButtonText: 'Okay',
                    });
                }
                );
    }

    handleProdMouseOver() {
        if (Object.entries(this.headerObj).length > 0) {
            if (this.headerObj.PRODUCT_DESCRIPTION.length >= 60 ) {
                this.prodHover = 1;
            }
        }
    }

    async updateHeaderStatus(action: number) {
        if (!this.receiverID && (this.headerObj.STATUS >= this.userType || this.userType < 3) && this.headerObj.STATUS < 3) {
            Swal.fire({
                title: 'Invalid Action',
                text: 'Please select receiver.',
                icon: 'error',
                confirmButtonText: 'Okay',
            });
            return;
        }
        // actions
        // 1: end production
        // 2: approve
        let isConfirmed: boolean;
        await Swal.fire({
            title: (action === 1 ? 'Confirm end production?' : 'Confirm approve?'),
            showCancelButton: true,
            text: (action === 1 ? 'Confirm end production?' : 'Confirm approve?'),
            icon: 'question',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((confirm) => {
            isConfirmed = confirm.isConfirmed;
          });
        if (isConfirmed) {
            // user types
            // 1 : manpower
            // 2 : supervisor
            // 3 : manager

            // status
            // 1 : wip
            // 2 : open
            // 3 : completed
            // 4 : closed
            switch (this.userType) {
                case 1:
                    this.headerObj.IS_CHANGED = 1;
                    this.headerObj.STATUS = 2;
                    this.headerObj.ACTUAL_END = this.timer.format('DD-MMM-YYYY HH:mm:ss');
                    this.headerObj.FORWARDED_BY = this.activeUser.ID;
                    this.headerObj.REVIEWED_BY = this.receiverID;
                    this.headerObj.FORWARDED_AT = this.timer.format('DD-MMM-YYYY HH:mm:ss');
                    break;
                case 2:
                    if (this.headerObj.STATUS < this.userType) {
                        this.headerObj.FORWARDED_BY = this.activeUser.ID;
                        this.headerObj.REVIEWED_BY = this.activeUser.ID;
                        this.headerObj.ACTUAL_END = this.timer.format('DD-MMM-YYYY HH:mm:ss');
                        this.headerObj.FORWARDED_AT = this.timer.format('DD-MMM-YYYY HH:mm:ss');
                    }
                    this.headerObj.IS_CHANGED = 1;
                    this.headerObj.STATUS = 3;
                    this.headerObj.REVIEWED_AT = this.timer.format('DD-MMM-YYYY HH:mm:ss');
                    this.headerObj.APPROVED_BY = this.receiverID;
                    break;
                case 3:
                case 4:
                    if (this.headerObj.STATUS === 1) {
                        this.headerObj.ACTUAL_END = this.timer.format('DD-MMM-YYYY HH:mm:ss');
                        this.headerObj.REVIEWED_AT = this.timer.format('DD-MMM-YYYY HH:mm:ss');
                        this.headerObj.FORWARDED_AT = this.timer.format('DD-MMM-YYYY HH:mm:ss');
                        this.headerObj.FORWARDED_BY = this.activeUser.ID;
                        this.headerObj.REVIEWED_BY = this.activeUser.ID;
                    } else if (this.headerObj.STATUS === 2) {
                        this.headerObj.REVIEWED_AT = this.timer.format('DD-MMM-YYYY HH:mm:ss');
                        this.headerObj.REVIEWED_BY = this.activeUser.ID;
                    }
                    this.headerObj.APPROVED_BY = this.activeUser.ID;
                    this.headerObj.IS_CHANGED = 1;
                    this.headerObj.STATUS = 4;
                    this.headerObj.APPROVED_AT = this.timer.format('DD-MMM-YYYY HH:mm:ss');
                    break;
            }
            this.header(false);
        }
    }

    setData(data) {
        this.headerObj = this.headerFactory.setHeader(data.header_obj);
        this.visibleStatus(this.headerObj.STATUS);
        this.manpowerService.setManpower(data.manpower_collection);
        this.activityService.setActivities(data.activity_collection);
        this.materialService.setMaterials(data.materials_collection);
    }

    setForwardList() {
       this.headerService.userForwardList
        .subscribe(
            res => {
                this.usersForwardList = res;
            },
            err => {
                console.log(err);
            }
        );
    }
}
