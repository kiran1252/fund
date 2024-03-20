import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { FilterPipe } from './filter.pipe';
import { FormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DatePipe } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.gaurd';
import { NgChartsModule } from 'ng2-charts';
import { CustomerComponent } from "./customer/customer.component";
import { NewCustomerComponent } from "./customer/New/new-customer/new-customer.component";
import { MonthlyEntryComponent } from './mothly-submission/monthly-entry/monthly-entry.component';
import { MonthlyCalculationComponent } from './mothly-submission/monthly-calculation/monthly-calculation.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FilterPipe,
    LoginComponent, CustomerComponent, NewCustomerComponent, MonthlyEntryComponent,MonthlyCalculationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AutocompleteLibModule,
    ReactiveFormsModule,
    FormsModule, NgChartsModule
  ],
  providers: [DatePipe, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }
