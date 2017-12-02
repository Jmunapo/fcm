import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { UtilsProvider } from '../../providers/utils/utils';
import { Events } from 'ionic-angular/util/events';

@IonicPage()
@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html'
})
export class SalesPage {
  salesInstorage: Array<any> = []; //get sales from storage
  productsInstorage: Array<any> = []; //get products in storage
  price_obj: any = {}; //hold prices of all items
  total_discounts: string = 'loading...';
  total_sale: string = 'loading...';

  constructor(public navCtrl: NavController,
              public database: DatabaseProvider,
              public modal: ModalController,
              public navParams: NavParams,
              private utils: UtilsProvider,
              private events: Events) {
    events.subscribe('Sales', () => {
      this.addSell();
    })
  }
  ionViewWillLoad() {
    //get from storage
    this.database.getData('products').then(v => {
      console.log(v);
      if (v) {
        this.productsInstorage = v;
        this.getPrices();
      }else{
        //Show add product Alert
        this.utils.showConfAret('Welcome', 'Add Products to start', 'Add', 'Not Now', 'Sales');
      }
    });

    this.database.getData('sales').then(value => {
      if (value) {
        console.log(value);
        this.salesInstorage = value.reverse();
      }
    });
  }

  getPrices(){
    let i = 0;
    let pro_size = this.productsInstorage.length;
    this.productsInstorage.forEach(element => {
      this.price_obj[element.product_name] = element.selling_price;
      i++
      if(i == pro_size){
        console.log(this.price_obj);
      }
    });
  }

  viewSale(sale_array: Array<any>, customer, date, method) {
    let sent_array: Array<any> = [];
    let len = sale_array.length;
    let i = 0;
    sale_array.forEach(element => {
      i++;
      let instance = {};
      let item_name = element.item_name;
      let quantity = Number(element.quantity);
      let disc = Number(element.discount);
      let price = Number(this.price_obj[item_name]);

      instance['date'] = this.dateFormart(date);
      instance['item_name'] = item_name;
      instance['quantity'] = quantity;
      instance['received'] = (price * quantity)-disc;
      sent_array.push(instance);
      
      if (i == len) {
        console.log(sent_array);
        this.view(sent_array, customer, method);
      }
    });
  }

  totalSale(){
    console.log(this.salesInstorage);
    this.salesInstorage.forEach(element => {
      console.log(element);
      element.item_array.forEach(elem => {
       // let price = this.price_obj[elem];
      });
    });
  }


  addSell(){
    let params = 'Record Sell';
    let col = 'secondary';
    let add = 'addSell';
    this.navCtrl.push('AddPage', {
      title: params,
      color: col,
      addthing: add
    });
  }

  dateFormart(datestring){
    let date = new Date(datestring);
    return date.toDateString();
  }

  view(sale_array: Array<any>, customer, method) {
    console.log(sale_array);
    let data = JSON.parse(JSON.stringify(sale_array));
    const history = this.modal.create('ViewModalPage', { title: 'View Sale', items: data, customer: customer, method: method }, {showBackdrop:false});
    history.present();
    history.onDidDismiss(data => {
      
    });
  }

 
  //Action When Alert dismissed
  action(){
    console.log('Toita basa');
  }
}
