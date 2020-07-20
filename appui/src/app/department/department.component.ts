import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
// import { ReactiveFormsModule , FormGroup, FormControlName, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departmentName;

  constructor(public http: HttpClient, public router: Router,) { }

  ngOnInit(): void {
  }

  submitDepartment() {
    if (this.departmentName) {
      const json = {
        departmentName: this.departmentName
      };

      this.http.post('localapi/departments', json)
          .subscribe(
              res => {
                console.log(res);
              },
              err => {
                console.log(err);
              }
          );
    }
  }

}
