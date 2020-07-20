import { ActivityDetailsComponent } from './../activity-details/activity-details.component';
import {
  Component,
  ElementRef,
  ViewChildren,
  AfterContentChecked,
  QueryList,
  OnInit
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-activity-downtime',
  templateUrl: './activity-downtime.component.html',
  styleUrls: ['./activity-downtime.component.css']
})
export class ActivityDowntimeComponent implements OnInit {

  mLotNumber: string;
  selectedActivityIndex: number;
  mPacked = 0;
  activity: any = [];
  tempActDowntime: Array<any> = [];
  downtimeTypes: any = [];
  selectedDowntimeTypeIndex;
  selectedDowntimeType: any = {};
  mMinutes = 0;
  mRemarks = '';
  mQuantity = 0;
  isChanged = 0;
  // tslint:disable-next-line: variable-name
  _isAuthorized: boolean;
  userType;

  @ViewChildren('modalHeaderInput') modalHeaderInput !: QueryList<ElementRef>;

  constructor(public activeModal: NgbActiveModal) {
    //
  }

  ngOnInit() {
    this.isAuthorized = this._isAuthorized;
    this.activity.ACTIVITY_DOWNTIME.forEach(el => {
      const actDowntime = {};
      Object.assign(actDowntime, el);
      this.tempActDowntime.push(actDowntime);
    });
  }

  // get selectedDowntimeType() {
  //   return this.downtimeTypes[this.selectedActivityIndex];
  // }
  modalEnter(event) {
    const elArr = this.modalHeaderInput.toArray();
    const active = elArr.findIndex(index => {
      return (index.nativeElement.parentElement === event.target.parentElement);
    });

    if (event.target.attributes.required && !event.target.value) {
      return;
    }

    if (active < elArr.length - 1) {
      elArr[active + 1].nativeElement.focus();
    } else {
      elArr.forEach((el, index) => {
        // TO DO catch if prev input is null
      });
      const newActivityDowntime = {
        DOWNTIME_TYPE_ID  : this.selectedDowntimeType.ID
        , MINUTES         : this.mMinutes
        , REMARKS         : this.mRemarks
        , QUANTITY        : this.mQuantity
        , ACTIVITY_ID     : this.activity.ID
        , CREATED_BY      : 1
        , CREATED_AT      : ''
        , IS_NEW          : 1
        , IS_CHANGED      : 0
      };
      this.isChanged = 1;
      this.tempActDowntime.push(newActivityDowntime);
      this.selectedDowntimeType = {};
      this.mMinutes = 0;
      this.mRemarks = '';
      this.mQuantity = 0;
      elArr[0].nativeElement.focus();
    }
  }

  handleDowntimeChange() {
    this.mMinutes = this.selectedDowntimeType.DEFAULT_MINUTES;
  }
  async handleSave() {
    if ( this.mMinutes !== 0
      || this.mQuantity !== 0
      || this.mRemarks !== '') {
        let isConfirmed: boolean;
        await Swal.fire({
          title: 'Confirm Exit?',
          showCancelButton: true,
          text: 'You will lose your unfinished input, proceed?',
          icon: 'warning',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((confirm) => {
          isConfirmed = confirm.isConfirmed;
        });
        if (isConfirmed) {
          this.mMinutes = 0;
          this.mQuantity = 0;
          this.mRemarks = '';
        } else {
          return;
        }
      }
    if (this.isChanged === 1) {
      this.activity.IS_CHANGED = 1;
    }
    this.activity.ACTIVITY_DOWNTIME = this.tempActDowntime;
    this.isChanged = 0;
    this.activeModal.dismiss('Save');
  }

  setIsChanged(index: number) {
    this.tempActDowntime[index].IS_CHANGED = 1;
    this.isChanged = 1;
    // this.activity.IS_CHANGED = 1;
  }

  get totalMinutes() {
    let res = 0;
    this.tempActDowntime.forEach(el => {
      res += el.MINUTES;
    });
    return res;
  }

  get totalQuantity() {
    let res = 0;
    this.tempActDowntime.forEach(el => {
      res += el.QUANTITY;
    });
    return res;
  }

  handleSelectChange(event, i) {
    const currValIndex = event.srcElement.attributes.selected_id.value;
    // const active = elArr.findIndex(index => {
    //   return (index.nativeElement.parentElement === event.target.parentElement);
    // });
    const newValIndex = event.srcElement.value;
    if (currValIndex !== null && currValIndex >= 0) {
      this.downtimeTypes[currValIndex].DISABLED = false;
    }
    if (newValIndex >= 0) {
      this.downtimeTypes[newValIndex].DISABLED = true;
    }
    this.setIsChanged(i);
  }

  get isAuthorized(): boolean {
    return this._isAuthorized;
  }

  set isAuthorized(authorized: boolean) {
    if (authorized) {
      switch (this.userType) {
        case 1:
          if (this.selectedActivityIndex > 0) { this._isAuthorized = false; }
          break;
      }
    }
  }
  inputMinutes() {
    if (this.mMinutes < 0) {
      Swal.fire({
        title: 'Warning',
        text: 'Invalid Value',
        icon: 'warning',
        confirmButtonText: 'OK',
      }).then( val => {
        this.mMinutes = 0;
      });
    } else if (this.mMinutes > 60) {
      Swal.fire({
        title: 'Warning',
        text: 'Invalid Value',
        icon: 'warning',
        confirmButtonText: 'OK',
      }).then( val => {
        this.mMinutes = 60;
      });
    }
  }

  inputQuantity() {
    if (this.mQuantity < 0) {
      Swal.fire({
        title: 'Warning',
        text: 'Invalid Value',
        icon: 'warning',
        confirmButtonText: 'OK',
      }).then( val => {
        this.mQuantity = 0;
      });
    }
  }
}
