// import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import Header from '../classes/header';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as io from 'socket.io-client';
import Swal from 'sweetalert2';
import { HeaderFactory } from '../classes/header-factory';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private dataSource = new Subject<any>();
  private headerSource = new Subject<any>();
  private headerCountSource = new Subject<any>();
  data$ = this.dataSource.asObservable();
  header$ = this.headerSource.asObservable();
  headerCount$ = this.headerCountSource.asObservable();
  header: Header;
  url: string;
  getDataRes: any;
  visibleStatus: any;
  userForwardList = new Subject<any>();
  userForwardList$ = this.userForwardList.asObservable();
  headerCountObj: Array<object>;
  currentData;
  socket;

  getHeaderCountPerStatus = new Observable<any>((observer) => {
    this.socket.on('updateHeaderStatus', (data) => {
      this.setUpdatedHeaderCountPerStatus('reload');
    });
  });

  getUpdatedHeader = new Observable((observer) => {
    this.socket.on('headerUpdated', async (data) => {
      const user = await this.apiService.isAuth().toPromise();
      const userID = (user ? user.ID : 0);
      const currentBarcode = (this.currentData ? this.currentData.header_obj.BARCODE : null);
      if (currentBarcode !== null) {
        if (data.barcode === currentBarcode) {
          if (data.user !== userID && userID !== 0) {
            Swal.fire({
              title: 'Notice',
              text: 'Transaction modified by another user.',
              icon: 'info',
              confirmButtonText: 'Reload',
              allowOutsideClick: false
            }).then( val => {
              this.getData(data.barcode);
              this.setUpdatedHeaderCountPerStatus('save');
            });
          } else {
            this.getData(data.barcode, true);
            this.setUpdatedHeaderCountPerStatus('save');
          }
        }
      }
    });
  });

  constructor(private apiService: ApiService,
              public http: HttpClient,
              private headerFactory: HeaderFactory,
            ) {
    // this.getHeaderCountPerStatus();
    this.url = environment.BE_SERVER;
    this.socket = io(this.url);
    this.setUpdatedHeaderCountPerStatus('load');
    this.getUpdatedHeader.subscribe();
    this.getHeaderCountPerStatus.subscribe();
  }

  setData(data) {
    // const header = new Header(data);
    this.dataSource.next(data);
    if (Object.keys(data).length > 0) {
        this.setHeaderObj(data.header_obj);
    } else {
        this.setHeaderObj(null);
    }
  }

  setHeaderObj(header) {
    let headerObj = {};
    if (header) {
        headerObj = this.headerFactory.setHeader(header);
    }
    this.headerSource.next(headerObj);
  }

  async setUpdatedHeaderCountPerStatus(reason: string) {
    await this.apiService.getHeaderCountPerStatus().toPromise()
    .then(
        res => {
          if (reason === 'save') {
            this.socket.emit('headerStatusUpdate', 1);
          } else {
            this.setHeaderCountPerStatus(res);
          }
        }
    );
  }

  setHeaderCountPerStatus(data) {
    this.headerCountSource.next(data);
  }

  getHeaderByStatus(data): Observable<any> {
    // const data = 'SO01-022020-818454';
    // data = String(data).toUpperCase();
    return this.http.post(this.url + '/t3api/get_header_by_status/', data, this.apiService.setHeaders());
  }

  async getData(barcodeNum, isCurrentUser = false) {
    if (!isCurrentUser) {
      Swal.fire({
        title: 'Now loading',
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
          Swal.showLoading();
        },
        onAfterClose: () => {
          document.getElementById('schedule_date').focus();
        }
      });
    }
    await this.apiService.getAllByBarcode(barcodeNum).toPromise()
    .then(
        res => {
          this.getDataRes = res;
        }
    );
    if (this.getDataRes.isExisting) {
        this.currentData = this.getDataRes;
        this.setData(this.getDataRes);
        if (!isCurrentUser) {
            Swal.close();
        }
        // this.activitiesSource.next(this.getDataRes.activity_collection);
        // this.materialsSource.next(this.getDataRes.materials_collection);

        const barcodeStatus = this.getDataRes.header_obj.STATUS;
        // this.visibleStatus(barcodeStatus);
    } else {
        await this.apiService.getNewBatch(barcodeNum).toPromise()
        .then(
            (res) => {
              this.getDataRes = res;
              Swal.close();
              if (this.getDataRes.isExisting) {
                this.getDataRes.header_obj.BARCODE = barcodeNum.toUpperCase();
                this.currentData = this.getDataRes;
                this.setData(this.getDataRes);
              } else {
                Swal.fire({
                  title: 'Error',
                  text: 'Transaction not found.',
                  icon: 'error',
                  confirmButtonText: 'Okay',
              });
              }
                // this.materialService.setMaterials(res.material_collection);
                // this.setHeaderObj(res.batch_collection[0]);
                // this.activityService.setActivities([]);
                // this.getDataRes = res;
            }
        ).catch(err => {
          Swal.close();
        });
    }

    document.getElementById('schedule_date').focus();
  }

  getUserForwardList() {
    this.apiService.forwardList()
    .subscribe(
        res => {
            this.userForwardList.next(res);
        },
        err => {
            console.log(err);
        }
    );
  }

  refreshSource() {
    if (this.currentData) {
      this.setHeaderObj(this.currentData);
    }
  }

  // getHeaderCountPerStatus(): Observable<Array<object>> {
  //   return new Observable((observer) => {
  //     this.socket.on('updateHeaderStatus', (data) => {
  //       observer.next(data);
  //     });
  //   });
  // }
}
