import { Component, Input } from '@angular/core';

@Component({
  selector: 'add-purchase',
  templateUrl: 'add-purchase.html'
})
export class AddPurchaseComponent {
  @Input('purchase') purchase;

  text: string;

  constructor() {
    console.log('Hello AddPurchaseComponent Component');
    this.text = 'Hello World';
  }
  ngAfterViewInit() {
    console.log(this.purchase)
    /*this.database.getData('purchases').then(v => {
      if (v) {
        this.purchase_arr = v;
        console.log(v)
      }
    });
    this.database.getData('products').then(value => {
      if (value) {
        this.products_instorage = value;
      }
    });*/
  }

}
