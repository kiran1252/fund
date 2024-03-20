import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { FirbaseService } from '../firbase.service';
import { mapValues, groupBy, omit, sum, sumBy } from 'lodash';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(
    private firbaseService: FirbaseService,
    private datePipe: DatePipe
  ) { }
  totalShares: any = 0;
  totalSharesAmount: any = 0;
  totalCust: any = 0;
  totalIntrestAmount: any = 0;
  filterDate: any = new Date();
  filterFromDate: any = new Date(new Date().getFullYear(), 0, 1);
  filterToDate: any = new Date(new Date().getFullYear(), 11, 31);
  title = 'ng2-charts-demo';
  filterOtion: any = 0;
  public barChartLegend = true;
  public barChartPlugins = [];
  isShowChart: boolean = false;

  public barChartOptions: ChartOptions = {
    responsive: false,
  };
  ngOnInit(): void {
    this.filterDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    //this.getCustomerList();
  }

  async getCustomerList() {
    var colData = collection(this.firbaseService.db, 'Customer');
    const q = query(
      colData,
      where('year', '==', this.filterOtion)
    );
    const data = await getDocs(q);
    var customerList = data.docs.map((doc) => doc.data());
    this.totalCust = customerList.length;
    var activeCustomersList = customerList.filter((w:any)=>w.isActive == true);
    this.totalShares = activeCustomersList.reduce(
      (partialSum: any, a: any) => partialSum + parseInt(a.shares),
      0
    );
    this.totalSharesAmount = customerList.reduce(
      (partialSum: any, a: any) => partialSum + parseInt(a.sharesAmount),
      0
    );
    this.totalIntrestAmount = customerList.reduce(
      (partialSum: any, a: any) => partialSum + parseInt(a.totalLoanIntrest) + parseInt(a.totalSharesPenaltyAmount),
      0
    );
    
  }

}
