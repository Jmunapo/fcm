import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html'
})
export class InventoryPage {
  purchase_code: Array<string> = ['All Purchases'];
  selected_purchase: string = '';
  inventory_instorage: Array<any> = [];
  purchases_instorage: Array<any> = [];
  stock_total: any;
  stock_profit: any;

  constructor(public navCtrl: NavController,
              private database: DatabaseProvider) {
  }

  ionViewWillLoad() {
    this.selected_purchase = this.purchase_code[0];
    this.database.getData('purchases').then(data => {
      if (data) {
        this.purchases_instorage = data
        for (let i = 0; i < data.length; i++) {
          let pur = data[i];
          this.purchase_code.push(pur.purchase_code);
        }
      }
    });
    this.database.getData('products').then(data => {
      if (data) {
        this.inventory_instorage = data
        console.log(this.inventory_instorage);
        this.calclate_total();
      }
    });

  }

  selected() {
    let slct = this.selected_purchase;
    console.log(slct);
    this.database.getData('products').then(data => {
      if(data){
        if (slct === 'All Purchases') {
          this.inventory_instorage = data;
        } else {
          this.inventory_instorage = data.filter(function (item) {
            console.log(item);
            return item.purchase_code === slct;
          });
        }
        this.calclate_total();
        console.log(this.inventory_instorage);
      }
    });
  }

  check_currency(curr_code){
    let data = this.purchases_instorage;
    let element = data.filter(function (item) {
      return item.purchase_code === curr_code;
    });
    let curr = element[0].buying_currency;
    if(curr === 'USD'){
      return '$';
    }else{
      return curr;
    }
  }

  currency_converter(purch_code, buyin_p){
    let b = this.purchases_instorage.findIndex(f => f.purchase_code === purch_code);
    let element = this.purchases_instorage[b];
    let rate = element.rate;
    return buyin_p/rate;
  }

  calclate_total(){
    let data = this.inventory_instorage;
    let selling: number = 0;
    let buying: number = 0;
    data.forEach(element => {
      let pur_code = element.purchase_code;
      let quant = element.quantity;
      //converting to USD
      let buyn = this.currency_converter(pur_code, element.buying_price);
      console.log(buyn);
      buying += Number(buyn * quant);
      selling += Number(element.selling_price * quant);
    });
    this.stock_total = selling;
    this.stock_profit = Number((selling - buying).toFixed(1));
  }

  add_product(title, color, addthing){
    this.navCtrl.push('AddPage', {
      title: title,
      color: color,
      addthing: addthing
    });
  }
  
}
