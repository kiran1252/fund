import { Component, OnInit, ViewChild } from '@angular/core';
import { doc, collection, getDocs, deleteDoc, query, where, updateDoc, getDoc } from 'firebase/firestore/lite';
import { forEach } from 'lodash';
import { FirbaseService } from 'src/app/firbase.service';
declare var $: any;
@Component({
  selector: 'app-monthly-calculation',
  templateUrl: './monthly-calculation.component.html'
})
export class MonthlyCalculationComponent implements OnInit {
  constructor(private firbaseService: FirbaseService) { }
  customerList: any = [];
  searchText: string = '';
  keyword = 'name';
  ngOnInit() {
    //this.getCustomerList();
  }
  filterOtion: any = 0;
  async getCustomerList() {
    var colData = collection(this.firbaseService.db, 'Customer');
    const q = query(
      colData,
      where('year', '==', this.filterOtion)
    );
    const data = await getDocs(q);
    var customerList = data.docs.map((doc) => doc.data());
    customerList.forEach((element: any) => {
      element['id'] = element['customerId'];
      this.customerList.push(element);
    });
    this.getSettings();
  }
  settingData: any = {};
  async getSettings() {
    var colData = collection(this.firbaseService.db, 'Settings');
    const q = query(
      colData,
      where('year', '==', this.filterOtion)
    );
    const data = await getDocs(q);
    var list = data.docs.map((doc) => doc.data());
    this.settingData = list[0];
    console.log(this.settingData);
  }

  selectedCustomer: any;
  async selectEvent(item: any) {
    const docRef = doc(this.firbaseService.db, 'Customer/' + item.customerId);
    const docSnap = await getDoc(docRef);
    this.selectedCustomer = docSnap.data();
    this.getPenaltyAmount();
    this.getIntrestCalculation();
  }
  inputCleared() {
    this.selectedCustomer = null;
  }
  penaltyPerShareAmount = 0;
  getPenaltyAmount() {
    var penaltyPerShare = this.settingData.penaltyOnShare;
    if (this.selectedCustomer != null) {
      const date = new Date();  // 2009-11-10
      const month = date.toLocaleString('default', { month: 'long' });
      var loopcnt = 1;
      for (let index = 0; index < this.selectedCustomer.monthlyValue.length; index++) {
        const element = this.selectedCustomer.monthlyValue[index];
        if (element.name == month) {
          break;
        }
        if (element.sharesamount == 0) {
          this.penaltyPerShareAmount = this.penaltyPerShareAmount + (penaltyPerShare * loopcnt);
          loopcnt++;
        } else {
          this.penaltyPerShareAmount = 0;
          loopcnt = 1;
        }
      }

    }
  }
  intrestAmount = 0;
  totalLoan = 0;
  totalLoanSubmited = 0;
  sharesamount = 0;
  loanIntrest = 0;
  getIntrestCalculation() {
  
    for (let index = 0; index < this.selectedCustomer.monthlyValue.length; index++) {
      const element = this.selectedCustomer.monthlyValue[index];
      this.totalLoan = this.totalLoan + element.loan;
      this.totalLoanSubmited = this.totalLoanSubmited + element.loanSubmit;
      this.loanIntrest = this.loanIntrest + element.loanIntrest;
      this.sharesamount = this.sharesamount + element.sharesamount;
    }
    var totalLoan = this.totalLoan - this.totalLoanSubmited;
    if (totalLoan > 0) {
      this.intrestAmount = (totalLoan * this.settingData.intrest) / 100;
      this.getPenaltyOfIntrest();
    }
  }
  penaltyIntrestAmount = 0;
  getPenaltyOfIntrest() {
    var penaltyPerShare = this.settingData.penaltyOnIntrest;
    if (this.selectedCustomer != null) {
      const date = new Date();  // 2009-11-10
      const month = date.toLocaleString('default', { month: 'long' });
      var loopcnt = 1;
      for (let index = 0; index < this.selectedCustomer.monthlyValue.length; index++) {
        const element = this.selectedCustomer.monthlyValue[index];
        if (element.name == month) {
          break;
        }
        if (element.loanIntrest == 0) {
          this.penaltyIntrestAmount = this.penaltyIntrestAmount + (penaltyPerShare * loopcnt) ;
          loopcnt++;
        } else {
          this.penaltyIntrestAmount = 0;
          loopcnt = 1;
        }
      }

    }
  }
}
