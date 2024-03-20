import { Component, OnInit } from '@angular/core';
import { doc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore/lite';
import { FirbaseService } from '../firbase.service';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  constructor(private firbaseService: FirbaseService) { }
  customerList: any = [];
  searchText: string = '';
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
    this.customerList = data.docs.map((doc) => doc.data());
    console.log(this.customerList)

  }
}
