import Swal from 'sweetalert2';
import Manpower from './../classes/manpower';
import { ManpowerService } from './../services/manpower.service';
import { Component, OnInit, AfterContentChecked, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ApiService } from '../services/api.service';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { UserService } from '../services/user.service';
import * as moment from 'moment';

@Component({
    selector: 'app-manpower',
    templateUrl: './manpower.component.html',
    styleUrls: ['../material/material.component.css', '../manpower/manpower.component.css']
})
export class ManpowerComponent implements OnInit {
    @ViewChildren('tdEditable') tdEditable !: QueryList<ElementRef>;
    positions: any = [];
    tempManpower: any = [];
    accounts: Array<any>;
    manpowerSelected = [];
    manpowerOnFocus = 0;
    activeUser;
    userID;
    userType: number;
    isAuthorized: boolean;
    apiResponse: any;

    constructor(public apis: ApiService,
                private manpowerService: ManpowerService,
                private userService: UserService) {
        this.manpowerService.manpower$.subscribe(
            async manpower => {
                this.manpowers = manpower;
                await this.getAllAccounts();
            }
        );
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

        userService.isAuthorized$.subscribe(isAuthorized => {
            this.isAuthorized = isAuthorized;
        });


    }

    async ngOnInit() {
        await this.apis.getAllPositions().toPromise().then(res => {
            this.positions = res;
        });
    }

    async getAllAccounts() {
        await this.apis.getManpowerList().toPromise()
            .then(
                res => {
                    this.accounts = res;
                    this.accounts.unshift({
                        ID: 0,
                        FIRST_NAME: 'No Manpower Setup',
                        LAST_NAME: '',
                        DISABLED: 0,
                    });
                }
            );
        if (!this.manpowers) {
            this.manpowers = this.manpowerService.manpowers;
        }
        this.manpowers.forEach((el, i) => {
            if (el.MANPOWER_ID > 0) {
                const accIndex = this.accounts.findIndex(x => x.ID === el.MANPOWER_ID);
                if (accIndex !== -1) {
                    this.accounts[accIndex].DISABLED = 1;
                    this.positions[i].SELECTED = el.MANPOWER_ID;
                    this.positions[i].SELECTED_INDEX = accIndex;
                }
            }
        });
    }

    handleChange(event, i) {
        const currValIndex = parseInt(event.srcElement.attributes.SELECTED_INDEX.value, 10);
        const options = event.srcElement.options;
        const newValIndex = options.selectedIndex;
        if (currValIndex > 0) {
            this.accounts[currValIndex].DISABLED = 0;
        }
        event.srcElement.attributes.SELECTED_INDEX.value = newValIndex;
        if (newValIndex > 0) {
            this.accounts[newValIndex].DISABLED = 1;
        }
        if (newValIndex === 0) {
            this.manpowers[i].START_TIME = '';
            this.manpowers[i].END_TIME = '';
            this.manpowers[i].REMARKS = '';
        }
        this.manpowers[i].setManpowerID(this.positions[i].SELECTED);
        this.handleInput(i);
    }

    async time(value: string, event, index: number, input: string) {
        const editable = this.tdEditable.toArray();

        const active = editable.findIndex(el => {
            return (el.nativeElement.parentElement === event.target.parentElement);
        });

        if (active < editable.length - 1) {
            const hasErrors = await this.validateInput(event, index, input, 'enter');
            if (!hasErrors) {
                editable[active + 1].nativeElement.focus();
            }
        } else {
            event.target.blur();
        }
    }

    preventEnter(e) {
        e.preventDefault();
    }

    handleInput(i: number) {
        this.manpowers[i].IS_CHANGED = 1;
    }

    async validateInput(event, index: number, input: string, reason: string) {
        let fulltime: string;
        let hasErrors = false;
        let message: string;

        if (input === 'start') {
            fulltime = this.manpowers[index].START_TIME.toString();
        } else {
            fulltime = this.manpowers[index].END_TIME.toString();
        }

        if (fulltime.length > 0 && fulltime.length <= 4) {
            const time = parseInt(fulltime.slice(0, 2), 10);
            const min = parseInt(fulltime.slice(2, 4), 10);
            const mntTime = moment(moment().format('MM/DD/YYYY') + ' ' + time + ':' + min);

            if (!mntTime.isValid()) {
                hasErrors = true;
                message = 'Invalid Time';
            }

            if (input === 'end') {
                const start = this.manpowers[index].START_TIME.toString();
                const startTime = parseInt(start.slice(0, 2), 10);
                const startMin = parseInt(start.slice(2, 4), 10);
                const startMntTime = moment(moment().format('MM/DD/YYYY') + ' ' + startTime + ':' + startMin);

                if (mntTime.isBefore(startMntTime)) {
                    hasErrors = true;
                    message = 'End time must be after start time';
                }
            }

            if (hasErrors) {
                if (input === 'start') {
                    this.manpowers[index].START_TIME = '';
                } else {
                    this.manpowers[index].END_TIME = '';
                }
                await Swal.fire({
                    title: 'Warning',
                    text: message,
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });
                if (reason === 'blur') {
                    event.target.focus();
                }
            }
        }
        return hasErrors;
    }

    get manpowers(): Array<Manpower> {
        return this.tempManpower;
    }

    set manpowers(manpowerCollection: Array<Manpower>) {
        if (manpowerCollection.length > 0 && this.activeUser) {
            const index = manpowerCollection.findIndex(el => el.MANPOWER_ID === this.activeUser.ID);
            const inchargeIndex = manpowerCollection.findIndex(el => el.POSITION_ID === 2);
            if (manpowerCollection[inchargeIndex].MANPOWER_ID === 0) {
                if (index !== -1) {
                    manpowerCollection[index].MANPOWER_ID = 0;
                }
                manpowerCollection[inchargeIndex].MANPOWER_ID = this.activeUser.ID;
            }
        }
        this.tempManpower = manpowerCollection;
    }

}
