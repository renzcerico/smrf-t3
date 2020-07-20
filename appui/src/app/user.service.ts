// import { recipient } from './recipient';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userLoggedIn: any = false;
  userLoggedInSub = new BehaviorSubject <string>('');

  userLevel = '';
  userLevelSub = new BehaviorSubject <string>('');

  user: any;
  userSub = new BehaviorSubject <string>('');

  progressMode: string;
  progressModeSub = new BehaviorSubject <string>('');

  recipient: string;
  recipientSub = new BehaviorSubject <string>('');

  jobOrder: number;
  jobOrderSub = new BehaviorSubject <number>(null);

  myImage: any;
  myImageSub = new BehaviorSubject <string>('');

  // WHEN CREATING A REQUEST
  srvcRequestAttachment = [];
  srvcRequestAttachmentSub = new BehaviorSubject <any>('');

  departments: any;
  departmentsSub = new BehaviorSubject <any>('');

  constructor(public http: HttpClient) {
    this.userLoggedInSub.next(this.userLoggedIn);
    this.progressModeSub.next(this.progressMode);
    // this.recipientSub.next(this.recipient);
    this.jobOrderSub.next(this.jobOrder);
    this.srvcRequestAttachmentSub.next(this.srvcRequestAttachment);
    this.myImageSub.next(this.myImage);

  }

  getAPI(url: string): Observable<any> {
    const headers = new Headers({'Content-Type' : 'application/json'});
    return this.http.get(url)
        .pipe(map((response: Response) => response),
          catchError(this.handleError));
  }

  private handleError(error: Response) {
      console.log('ERROR::STATUS:::::' + error.status);
      console.log('ERROR::STATUS TEXT:::::' + error.statusText);
      if (error.status === 504 || error.status === 502 || error.status === 503) {
          return of('');
      } else {
        return of(JSON.stringify(error) || 'Server error');
      }
  }
}
