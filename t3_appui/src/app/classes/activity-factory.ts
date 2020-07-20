import { ServertimeService } from './../services/servertime.service';
import { MaterialService } from './../services/material.service';
import Activity from './activity';
import { Injectable } from '@angular/core';

@Injectable()
export class ActivityFactory {
    constructor(private materialService: MaterialService, private serverTimeService: ServertimeService) {}
    public createActivity(jsonObj) {
        return new Activity(jsonObj, this.materialService, this.serverTimeService);
    }
}
