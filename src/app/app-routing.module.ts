import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.gaurd';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {  CustomerComponent } from "./customer/customer.component";
import {  NewCustomerComponent } from "./customer/New/new-customer/new-customer.component";
import { MonthlyEntryComponent } from './mothly-submission/monthly-entry/monthly-entry.component';
import { MonthlyCalculationComponent } from './mothly-submission/monthly-calculation/monthly-calculation.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard] },
  { path: 'cust', component: CustomerComponent,canActivate: [AuthGuard] },
  { path: 'new-cust', component: NewCustomerComponent,canActivate: [AuthGuard] },
  { path: 'monthly-entry', component: MonthlyEntryComponent,canActivate: [AuthGuard] },
  { path: 'monthly-calculation', component: MonthlyCalculationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
