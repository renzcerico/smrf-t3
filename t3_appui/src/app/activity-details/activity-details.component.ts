import { ActivityFactory } from './../classes/activity-factory';
import {
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
  Renderer2,
  OnInit,
  AfterContentChecked
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activity-details',
  templateUrl: './activity-details.component.html',
  styleUrls: ['./activity-details.component.css']
})
export class ActivityDetailsComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  in_activity: any = [];
  mLotNumber = '';
  mPacked = 0;
  selectedActivityIndex: number;
  tempActDetails: Array<any> = [];
  activity: any = {};
  isChanged = 0;
  userType: number;
  // tslint:disable-next-line: variable-name
  _isAuthorized: boolean;

  @ViewChildren('modalHeaderInput') modalHeaderInput !: QueryList<ElementRef>;

  constructor(public activeModal: NgbActiveModal,
              private activityFactory: ActivityFactory) {
  }

  ngOnInit() {
    this.isAuthorized = this._isAuthorized;
    this.in_activity.ACTIVITY_DETAILS.forEach(el => {
      const actDetail = {};
      Object.assign(actDetail, el);
      this.tempActDetails.push(actDetail);
    });
  }

  modalEnter(event) {
    const elArr = this.modalHeaderInput.toArray();
    const active = elArr.findIndex(index => {
      return (index.nativeElement.parentElement === event.target.parentElement);
    });

    if (event.target.attributes.required && (!event.target.value || event.target.value < 1)) {
      return;
    }

    if (active < elArr.length - 1) {
      elArr[active + 1].nativeElement.focus();
    } else {
      const newActivityDetail = {
        LOT_NUMBER      : this.mLotNumber,
        PACKED_QTY      : this.mPacked,
        ADJ_QTY         : 0,
        IS_NEW          : 1,
        IS_CHANGED      : 0
      };
      this.isChanged = 1;
      this.tempActDetails.push(newActivityDetail);
      this.mPacked = 0;
      this.mLotNumber = '';
      elArr[0].nativeElement.focus();
    }

  }

  setIsChanged(index: number, field: string = '') {
    this.tempActDetails[index].IS_CHANGED = 1;
    this.isChanged = 1;
  }

  get packedQty() {
    let res = 0;
    this.tempActDetails.forEach(el => {
      res += el.PACKED_QTY;
    });
    return res;
  }

  get adjQty() {
    let res = 0;
    this.tempActDetails.forEach(el => {
      res += el.ADJ_QTY;
    });
    return res;
  }

  get total() {
    return this.packedQty + this.adjQty;
  }

  async handleSave() {
    if ( this.mLotNumber !== ''
      || this.mPacked !== 0) {
        let isConfirmed: boolean;
        await Swal.fire({
            title: 'Confirm Save?',
            showCancelButton: true,
            text: 'You will lose your unfinished input, proceed?',
            icon: 'warning',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
          }).then((confirm) => {
            isConfirmed = confirm.isConfirmed;
          });
        if (isConfirmed) {
          this.mPacked = 0;
          this.mLotNumber = '';
        } else {
          return;
        }
      }
    if (this.isChanged === 1) {
      this.in_activity.IS_CHANGED = 1;
      this.in_activity.ACTIVITY_DETAILS = this.tempActDetails;
    }
    this.isChanged = 0;
    this.activeModal.dismiss('Cross click');
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

  get canUpdate(): boolean {
    if (this.userType === 1) {
      return false;
    }
    return true;
  }

  get canAdd(): boolean {
    if (this.userType === 1) {
      if (this.selectedActivityIndex > 0 ) { return false; }
    }
    return true;
  }

  inputPacked() {
    if (this.mPacked < 0) {
      Swal.fire({
        title: 'Warning',
        text: 'Invalid Value',
        icon: 'warning',
        confirmButtonText: 'OK',
      }).then( val => {
        this.mPacked = 0;
      });
    }
  }
}
