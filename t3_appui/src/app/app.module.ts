import { HeaderFactory } from './classes/header-factory';
import { AccountFactory } from './classes/account-factory';
import { ActivityFactory } from './classes/activity-factory';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from './services/api.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { HeaderComponent } from './header/header.component';
import { MaterialComponent } from './material/material.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManpowerComponent } from './manpower/manpower.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './footer/footer.component';
import { AutosizeModule } from 'ngx-autosize';
import { ActivityComponent } from './activity/activity.component';
import { ActivityDetailsComponent } from './activity-details/activity-details.component';
import { ActivityDowntimeComponent } from './activity-downtime/activity-downtime.component';
import { AccountsComponent } from './accounts/accounts.component';

import { Routes, RouterModule } from '@angular/router';
import { HeaderModalComponent } from './header-modal/header-modal.component';
import { CounterPipePipe } from './counter-pipe.pipe';
import { LoginComponent } from './modals/login/login.component';
import { AddRowComponent } from './modals/add-row/add-row/add-row.component';

@NgModule({
declarations: [
AppComponent,
TopBarComponent,
HeaderComponent,
MaterialComponent,
ManpowerComponent,
FooterComponent,
ActivityComponent,
ActivityDetailsComponent,
ActivityDowntimeComponent,
AccountsComponent,
HeaderModalComponent,
CounterPipePipe,
LoginComponent,
AddRowComponent
],
entryComponents: [
ActivityDetailsComponent,
ActivityDowntimeComponent,
HeaderModalComponent,
LoginComponent,
AddRowComponent
],
imports: [
AutosizeModule,
BrowserModule,
FontAwesomeModule,
AppRoutingModule,
FormsModule,
ReactiveFormsModule,
BrowserAnimationsModule,
HttpClientModule,
NgbModule,
],
providers: [
ApiService,
ActivityFactory,
AccountFactory,
HeaderFactory,
// { provide: LocationStrategy, useClass: HashLocationStrategy }
],
bootstrap: [AppComponent]
})
export class AppModule {
}
