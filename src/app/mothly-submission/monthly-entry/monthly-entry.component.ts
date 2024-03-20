import { Component, OnInit, ViewChild } from '@angular/core';
import { doc, collection, getDocs, deleteDoc, query, where, updateDoc, getDoc } from 'firebase/firestore/lite';
import { FirbaseService } from 'src/app/firbase.service';
declare var $: any;
@Component({
  selector: 'app-mothly-entry',
  templateUrl: './monthly-entry.component.html',
  styleUrls: ['./monthly-entry.component.css'],
})
export class MonthlyEntryComponent implements OnInit {
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
  }
  selectedCustomer: any;
  async selectEvent(item: any) {
    const docRef = doc(this.firbaseService.db, 'Customer/' + item.customerId);
    const docSnap = await getDoc(docRef);
    this.selectedCustomer = docSnap.data();
  }
  inputCleared() {
    this.selectedCustomer = null;
  }

  submitMonthlyData() {
    this.selectedCustomer.sharesAmount = this.getTotalShareAmount()
    this.selectedCustomer.totalLoan = this.getTotalLoan()
    this.selectedCustomer.totalLoanSubmited = this.getTotalLoanSubmited()
    this.selectedCustomer.totalLoanIntrest = this.getTotalLoanIntrest()
    this.selectedCustomer.totalSharesPenaltyAmount = this.getTotalpenaltyAmount()
    updateDoc(
      doc(this.firbaseService.db, 'Customer', '' + this.selectedCustomer.customerId),
      this.selectedCustomer
    ).then(() => {
      alert('Entry updated successfully!');
      this.selectedCustomer = null;
      $(".x").trigger("click");
    });
  }
  getTotalShareAmount()
  {
    var amount = this.selectedCustomer.monthlyValue.reduce(
      (partialSum: any, a: any) => partialSum + parseInt(a.sharesamount),
      0
    );
    return amount;
  }
  getTotalSharesAmount() {
    var amount = this.selectedCustomer.monthlyValue.reduce(
      (partialSum: any, a: any) => partialSum + parseInt(a.sharesamount),
      0
    );
    return amount;
  }

  getTotalpenaltyAmount() {
    var amount = this.selectedCustomer.monthlyValue.reduce(
      (partialSum: any, a: any) => partialSum + parseInt(a.penalty),
      0
    );
    return amount;
  }

  getTotalLoan() {
    var amount = this.selectedCustomer.monthlyValue.reduce(
      (partialSum: any, a: any) => partialSum + parseInt(a.loan),
      0
    );
    return amount;
  }

  getTotalLoanSubmited() {
    var amount = this.selectedCustomer.monthlyValue.reduce(
      (partialSum: any, a: any) => partialSum + parseInt(a.loanSubmit),
      0
    );
    return amount;
  }

  getTotalLoanIntrest() {
    var amount = this.selectedCustomer.monthlyValue.reduce(
      (partialSum: any, a: any) => partialSum + parseInt(a.loanIntrest),
      0
    );
    return amount;
  }
}
