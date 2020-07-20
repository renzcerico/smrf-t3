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
  inputErrors: Array<number> = [];
  @ViewChildren('modalHeaderInput') modalHeaderInput !: QueryList<ElementRef>;

  constructor(public activeModal: NgbActiveModal,
              private activityFactory: ActivityFactory,
              private el: ElementRef,
              private renderer: Renderer2) {
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
    const withErrors = [];
    const active = elArr.findIndex(index => {
      return (index.nativeElement.parentElement === event.target.parentElement);
    });

    // if (event.target.attributes.required && (!event.target.value || event.target.value < 1)) {
    //   return;
    // }
    elArr.forEach(el => {
      const id = el.nativeElement.attributes.id.value;
      let errorMessage = '';
      if (el.nativeElement.hasAttribute('required') && (!el.nativeElement.value || el.nativeElement.value < 1)) {
        errorMessage = 'This field is required';
      }

      if (id === 'packed_input') {
        if (el.nativeElement.value % 1) {
          errorMessage = 'This field can not contain decimal places';
        }
        if (el.nativeElement.value < 0) {
          errorMessage = 'This field can not contain a negative value';
        }
      }

      if (errorMessage.length) {
        withErrors.push({
          el: el.nativeElement,
          errorMessage
        });
      }
    });

    if (active < elArr.length - 1) {
      elArr[active + 1].nativeElement.focus();
    } else {

      if (withErrors.length) {
        this.showErrors(withErrors);
        return;
      }

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
    if (this.inputErrors.length) {
      Swal.fire({
        title: 'Error',
        showCancelButton: true,
        text: 'Please fix all errors before submitting',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
      return;
    }
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

  showErrors(errors: Array<any>): void {
    errors.forEach(error => {
      error.el.classList.add('is-invalid');
      const invalidComponent = this.el.nativeElement.querySelector('div[for="' + error.el.attributes.id.value + '"]');
      this.renderer.setProperty(invalidComponent, 'innerHTML', error.errorMessage);
      // invalidComponent.innerHTML('burat');
    });
    errors[0].el.focus();
  }

  handleInputChange(event) {
    // if (event.target.hasClass('is-invalid')) {
      event.target.classList.remove('is-invalid');
    // }
  }

  denyDecimal(event) {
    if (event.keyCode === 110 || event.keyCode === 190) {
      return false;
    }
  }

  adjBlur(event, index) {
    if (event.target.value % 1) {
      const currInput = this.inputErrors.findIndex(el => el === index);
      const invalidComponent = this.el.nativeElement.querySelector('#adj_' + index);
      this.renderer.setProperty(invalidComponent, 'innerHTML', 'This field can not contain decimal places');
      if (currInput < 0) {
        event.target.classList.add('is-invalid');
        this.inputErrors.push(index);
      }
    } else if ((this.tempActDetails[index].ADJ_QTY + this.tempActDetails[index].PACKED_QTY) < 0) {
      const currInput = this.inputErrors.findIndex(el => el === index);
      const invalidComponent = this.el.nativeElement.querySelector('#adj_' + index);
      this.renderer.setProperty(invalidComponent, 'innerHTML', 'Invalid Adjustment value');
      if (currInput < 0) {
        event.target.classList.add('is-invalid');
        this.inputErrors.push(index);
      }
    } else {
      const currInput = this.inputErrors.findIndex(el => el === index);
      if (currInput >= 0) {
        this.inputErrors.splice(currInput, 1);
        event.target.classList.remove('is-invalid');
      }
    }
  }
}
