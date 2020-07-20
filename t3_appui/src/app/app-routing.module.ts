import { ActivityComponent } from './activity/activity.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { AccountsComponent } from './accounts/accounts.component';

const routes: Routes = [
{
    path: '',
    component: HeaderComponent
},
{
    path: 'accounts',
    component: AccountsComponent
},
{
path: '**',
component: HeaderComponent
},
// {
//     path: '**',
//     component: ActivityComponent
//     },
];
@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
