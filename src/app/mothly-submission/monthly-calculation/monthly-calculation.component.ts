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
    this.customerList = [];
    this.selectedCustomer = null;
    if (this.filterOtion == "0") {
      return;
    }
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
  }

  selectedCustomer: any;
  async selectEvent(item: any) {
    const docRef = doc(this.firbaseService.db, 'Customer/' + item.customerId);
    const docSnap = await getDoc(docRef);
    this.selectedCustomer = docSnap.data();
    this.getPenaltyAmount();
    this.getIntrestCalculation();
    this.getTotalShareAmount();
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
      for (let index = 0; index < this.selectedCustomer.monthlyValue.length; index++) {
        const element = this.selectedCustomer.monthlyValue[index];
        if (element.name == month) {
          break;
        }
        if (element.sharesamount == 0) {
          if(this.penaltyPerShareAmount ==0)
          this.penaltyPerShareAmount = (this.penaltyPerShareAmount)+ (penaltyPerShare * this.selectedCustomer.shares);
          else
          this.penaltyPerShareAmount = this.penaltyPerShareAmount * 2;
        } else {
          this.penaltyPerShareAmount = 0;
        }
      }

    }
  }

  totalShareAmount = 0;
  getTotalShareAmount() {
    if (this.selectedCustomer != null) {
      const date = new Date();  // 2009-11-10
      const month = date.toLocaleString('default', { month: 'long' });
      for (let index = 0; index < this.selectedCustomer.monthlyValue.length; index++) {
        const element = this.selectedCustomer.monthlyValue[index];
        if (element.sharesamount == 0) {
          this.totalShareAmount = this.totalShareAmount + (this.selectedCustomer.shares * this.selectedCustomer.price);
        } else {
          this.totalShareAmount = 0;
        }
        if (element.name == month) {
          break
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
    this.sharesamount = 0;
    this.totalLoan = 0;
    this.totalLoanSubmited = 0;
    this.sharesamount = 0;
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
      for (let index = 0; index < this.selectedCustomer.monthlyValue.length; index++) {
        const element = this.selectedCustomer.monthlyValue[index];
        if (element.name == month) {
          break;
        }
        if (element.loanIntrest == 0) {
          if(this.penaltyIntrestAmount == 0)
          this.penaltyIntrestAmount = ((this.penaltyIntrestAmount) + (penaltyPerShare * this.selectedCustomer.shares));
          else
          this.penaltyIntrestAmount = this.penaltyIntrestAmount * 2;
        } else {
          this.penaltyIntrestAmount = 0;
        }
      }

    }
  }
}
