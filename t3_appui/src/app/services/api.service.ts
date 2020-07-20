import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Observer } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  url: string;
  response: any = {};
  constructor(public http: HttpClient) {
    //   this.url = environment.BE_SERVER;
  }

    setHeaders() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
            }),
            withCredentials: true
        };
        return httpOptions;
    }

    getHeader(): Observable<any> {
        return this.http.get('/t3api/header');
    }

    loginAPI(data): Observable<any> {
        return this.http.post('/t3api/login', data, this.setHeaders());
    }

    getManpower(): Observable<any> {
        return this.http.get('/t3api/personnel');
    }

    getExternalData(barcode): Observable<any> {
        barcode = 'SO01-022020-818454';
        return this.http.get('http://t2apps.tailinsubic.com/api/t2_header?prodno=' + barcode);
    }

    getAllByBarcode(data): Observable<any> {
        // const data = 'SO01-022020-818454';
        data = String(data).toUpperCase();
        return this.http.get('/t3api/get_all_by_barcode/' + data);
    }

    header(data): Observable<any> {
        return this.http.post('/t3api/store_all', data);
    }

    createAccount(data): Observable<any> {
        return this.http.post('/t3api/accounts', data);
    }

    resetPassword(id): Observable<any> {
        return this.http.post('/t3api/accounts/reset', id);
    }

    getAllAccounts(data): Observable<any> {
        return this.http.post('/t3api/get-all-accounts', data);
    }

    getManpowerList(): Observable<any> {
        return this.http.get('/t3api/get-manpower-list');
    }

    getAccountById(id): Observable<any> {
        return this.http.get('/t3api/accounts/' + id);
    }

    getDowntimeTypes(): Observable<any> {
        return this.http.get('/t3api/get_downtime_types');
    }

    getNewBatch(barcode): Observable<any> {
        return this.http.get('/t3api/t3Batch_info/' + barcode);
    }

    getHeaderCountPerStatus(): Observable<any> {
        return this.http.get('/t3api/get_header_count_per_status', this.setHeaders());
    }

    isAuth(): Observable<any> {
        return this.http.get('/t3api/auth', this.setHeaders());
    }

    logout(): Observable<any> {
        return this.http.get('/t3api/logout', this.setHeaders());
    }

    forwardList(): Observable<any> {
        return this.http.get('/t3api/forward-list', this.setHeaders());
    }

    getServerTime(): Observable<any> {
        return this.http.get('/t3api/get-server-time');
    }

}
