import { WebsocketService } from './../websocket.service';
import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MsgComponent } from './../msg/msg.component';
import { MatSnackBar, MatSnackBarModule  } from '@angular/material/snack-bar';
// import { ReactiveFormsModule , FormGroup, FormControlName, Validators, FormControl } from '@angular/forms';

export interface DialogData {
    id: number;
}
@Component({
    selector: 'app-department',
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
    departmentName;
    representativeID: number;
    serviceRepresentativeID: number;
    departmentID: number = null;
    users: Array<{ id: number, name: string }> = [];
    editDepartment = false;
    response: any;

    constructor(public http: HttpClient,
                public webSocketService: WebsocketService,
                public router: Router,
                @Inject(MAT_DIALOG_DATA) public data: DialogData,
                public dialog: MatDialog,
                private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.departmentID = this.data.id;
        this.getUsersByDepartment();
        this.getDepartmentDetails();
    }

    showSnackbar(msg) {
        this.snackBar.openFromComponent(MsgComponent, {
            duration: 10000,
        });
    }

    submitDepartment() {
        // Add department
        if (!this.editDepartment) {
            this.addDepartment();
            return;
        }

        if (this.editDepartment) {
            // Update department
            this.updateDepartment();

            if (this.serviceRepresentativeID) {
                // Update service representative
                this.updateServiceRepresentative();
                return;
            }

            // Add service representative
            this.addServiceRepresentative();
        }
        this.showSnackbar('Test');
        this.dialog.closeAll();
    }

    addServiceRepresentative() {
        const data = {
            departmentID: this.departmentID,
            department: this.departmentName,
            representativeID: this.representativeID
        };

        this.http.post('localapi/service-representatives', data)
            .subscribe(
                res => {
                    console.log(res);
                    this.webSocketService.updateDepartments();
                },
                err => {
                    console.log(err);
                }
            );
    }

    updateServiceRepresentative() {
        const data = {
            departmentID: this.departmentID,
            department: this.departmentName,
            representativeID: this.representativeID
        };

        this.http.post('localapi/service-representatives/' + this.serviceRepresentativeID, data)
            .subscribe(
                res => {
                    console.log(res);
                    this.webSocketService.updateDepartments();
                },
                err => {
                    console.log(err);
                }
            );
    }

    addDepartment() {
        if (this.departmentName) {
            const json = {
                departmentName: this.departmentName
            };

            this.http.post('localapi/departments', json)
                .subscribe(
                    res => {
                        console.log(res);
                        this.webSocketService.updateDepartments();
                    },
                    err => {
                        console.log(err);
                    }
                );
        }
    }

    updateDepartment() {
        if (this.departmentName) {
            const json = {
                departmentName: this.departmentName
            };

            this.http.post('localapi/departments/' + this.departmentID, json)
                .subscribe(
                    res => {
                        console.log(res);
                        this.webSocketService.updateDepartments();
                    },
                    err => {
                        console.log(err);
                    }
                );
        }
    }

    getUsersByDepartment() {
        const department = this.departmentID;

        if (department) {
            this.editDepartment = !this.editDepartment;

            this.http.get('localapi/users/dept/' + department)
                .subscribe(
                    res => {
                        // const data = res;
                        this.response = res;

                        if (this.response) {
                            for (let i = 0; i < this.response.length; i++) {
                                const json = {
                                    id: this.response[i].ID,
                                    name: this.response[i].FULL_NAME,
                                };

                                this.users.push(json);
                            }
                        }
                    },
                    err => {
                        console.log(err);
                    }
                );
        }
    }

    getDepartmentDetails() {
        const department = this.departmentID;

        if (department) {
            this.http.get('localapi/departments/' + department)
                .subscribe(
                    res => {
                        this.departmentName = res[0].NAME;
                        this.representativeID = res[0].PERSON_ID;
                        this.serviceRepresentativeID = res[0].REP_ID;
                    },
                    err => {
                        console.log(err);
                    }
                );
        }
    }

}
