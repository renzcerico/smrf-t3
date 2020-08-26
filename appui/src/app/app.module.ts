import { SidenavServiceService } from './sidenav-service.service';

import { AuthenticateGuard } from './authenticate.guard';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AutosizeModule } from 'ngx-autosize';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfigModule } from './appconfig.module';

import { AppConfigService } from './_services';
import { LoginComponent } from './login/login.component';

import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatDatetimePickerModule,
         NgxMatTimepickerModule,
         NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RequestComponent } from './requests/request/request.component';
import { RequestFormComponent } from './requests/request-form/request-form.component';
import { RequestModalComponent } from './requests/request-modal/request-modal.component';
import { ManageRequestsComponent } from './requests/manage-requests/manage-requests.component';
import { RequestDetailsComponent } from './requests/request-details/request-details.component';
import { RequestAcceptanceComponent } from './requests/request-acceptance/request-acceptance.component';
import { RequestClosedComponent } from './requests/request-closed/request-closed.component';
import { RequestSummaryComponent } from './requests/request-summary/request-summary.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { FooterComponent } from './footer/footer.component';
import { UserComponent } from './user/user.component';
import { JobOrderSummaryComponent } from './jobs/job-order-summary/job-order-summary.component';
import { JobComponent } from './jobs/job/job.component';
import { ManageJobOrderComponent } from './jobs/manage-job-order/manage-job-order.component';
import { JobOrderComponent } from './jobs/job-order/job-order.component';
import { JobOrderFormComponent } from './jobs/job-order-form/job-order-form.component';
import { RecipientComponent } from './recipient/recipient.component';
import { ManpowerComponent } from './manpower/manpower.component';
import { DepartmentServicesComponent } from './department-services/department-services.component';
import { DepartmentComponent } from './department/department.component';
import { ServicesDialogComponent } from './services-dialog/services-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';

import * as $ from 'jquery';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RequestComponent,
    RequestFormComponent,
    TopBarComponent,
    FooterComponent,
    UserComponent,
    ManageRequestsComponent,
    RequestModalComponent,
    RequestDetailsComponent,
    RequestAcceptanceComponent,
    RequestClosedComponent,
    JobOrderSummaryComponent,
    JobComponent,
    ManageJobOrderComponent,
    JobOrderComponent,
    PageNotFoundComponent,
    RequestSummaryComponent,
    JobOrderFormComponent,
    RecipientComponent,
    ManpowerComponent,
    DepartmentServicesComponent,
    DepartmentComponent,
    ServicesDialogComponent,
    ChangePasswordComponent,
    ProfileComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    AutosizeModule,
    // app comfiguration module
    AppConfigModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: '', canActivate: [AuthenticateGuard], children: [
        { path: 'request', component: RequestComponent },
        { path: 'requests/:id', component: RequestDetailsComponent },
        { path: 'jobs/:id', component: JobOrderComponent },
        { path: 'modal', component: RequestModalComponent },
        { path: 'manage-request', component: ManageRequestsComponent },
        { path: 'completed/:id', component: RequestAcceptanceComponent },
        { path: 'closed/:id', component: RequestClosedComponent },
        { path: 'job', component: JobComponent },
        { path: 'manage-jobs/:id', component: ManageJobOrderComponent },
        { path: 'administrator', component: DepartmentServicesComponent },
        { path: '**', component: PageNotFoundComponent },
      ]}
    ]),
    BrowserAnimationsModule,
    MatSliderModule,
    MatInputModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressBarModule,
    MatCardModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatGridListModule,
    MatListModule,
    MatIconModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatSnackBarModule,
  ],
  entryComponents: [
    // DepartmentComponent
  ],
  providers: [ AppConfigService,
  SidenavServiceService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }


