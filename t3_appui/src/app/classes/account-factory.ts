import { HeaderFactory } from './header-factory';
import { Injectable } from '@angular/core';
import { HeaderService } from '../services/header.service';
import Account from './account';

@Injectable()
export class AccountFactory {
    constructor(private headerService: HeaderService, private headerFactory: HeaderFactory) {}
    public setAccount(jsonObj: object) {
        return new Account(jsonObj, this.headerService, this.headerFactory);
    }
}
