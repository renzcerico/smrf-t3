import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from './../../services/api.service';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})

export class ChangePasswordComponent implements OnInit {
  modalForm: FormGroup;
  message: string;
  wrongPassword: boolean;

  constructor(private apiService: ApiService, private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.wrongPassword = false;
    this.modalForm = new FormGroup({
      old_password: new FormControl('', Validators.required),
      new_password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirm_password: new FormControl('', Validators.required),
    }, { validators: passwordMatchValidator });

    this.old_password.valueChanges.subscribe(res => {
      this.wrongPassword = false;
    });
  }

  get old_password() { return this.modalForm.get('old_password'); }
  get new_password() { return this.modalForm.get('new_password'); }
  get confirm_password() { return this.modalForm.get('confirm_password'); }

  async handleSubmit() {
    if (this.modalForm.valid) {
      Swal.fire({
        title: 'Saving...',
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
          Swal.showLoading();
        }
      });
      await this.apiService.changePassword(this.modalForm.value).toPromise()
        .then(res => {
          Swal.close();
          if (res === 0) {
            this.wrongPassword = true;
          } else {
            Swal.fire(
              'Success',
              'Password Updated',
              'success'
            ).then(response => {
              this.activeModal.dismiss('success');
            });
          }
        });
    }
  }

}

export const passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('new_password');
  const confirmPassword = control.get('confirm_password');
  return password.valid && confirmPassword.valid && password.value !== confirmPassword.value ? { passwordsDontMatch: true } : null;
};
