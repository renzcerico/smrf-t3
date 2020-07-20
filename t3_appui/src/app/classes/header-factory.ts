import { ServertimeService } from './../services/servertime.service';
import { Injectable } from '@angular/core';
import Header from './header';

@Injectable()
export class HeaderFactory {
    constructor(private servertimeService: ServertimeService) {}
    public setHeader(jsonObj: object) {
        return new Header(jsonObj, this.servertimeService);
    }
}
