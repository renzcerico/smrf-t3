import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    constructor() {
    }
    socket = io('/smrf');

    departmentsUpdated = new Observable<any>((observer) => {
        this.socket.on('departmentsUpdated', () => {
            console.log('updated');
            observer.next();
        });
    });

    updateDepartments() {
        this.socket.emit('departmentsUpdated');
    }
}
