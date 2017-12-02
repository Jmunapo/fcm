import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';


@IonicPage()
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {
  product: {
    product_name: string,
    buying_currency: string,
    buying_price: number,
    selling_price: number,
    quantity: number,
    description: string
  } = {
      product_name: '',
      buying_currency: 'USD',
      buying_price: null,
      selling_price: null,
      quantity: 1,
      description: ''
    }
    productArray: Array<any> = [];
    stock_total: number;
    stock_profit: number;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public modal: ModalController,
    public toaster: ToastController,
    private database: DatabaseProvider ) {
  }

  ionViewDidLoad() {
    this.database.getData('products').then(val => {
      if (val) {
        console.log(val);
        this.productArray = val;
        this.calculateStock(val);
      }
    });
  }

  calculateStock(val: Array<any>){
    let selling: number = 0;
    let buying: number = 0;
    val.forEach(element => {
      let quant = element.quantity;
      buying += Number(element.buying_price * quant);
      selling += Number(element.selling_price * quant);
    });
    this.stock_total = selling;
    this.stock_profit = Number((selling-buying).toFixed(1));
  }

  tonumber(str){
    return Number(str);
  }

  addMoreProducts(){
    let val = this.productArray;
    let data = JSON.parse(JSON.stringify(this.product));
    let len = val.length;
    const product = this.modal.create(
        'ModalsPage', { title: 'Add Products', 
        product: data, instorage: val }, 
        { enableBackdropDismiss: false }
    );
    product.present();
    product.onDidDismiss(data => {
      if (data != '') {
        let nowLen = data.length;
        let newData = nowLen-len;
        console.log(data);
        this.database.setData('products', data).then(val => {
          this.simpleToster(newData+' Product(s) Added');
          this.calculateStock(data);
        });
      }
    });
  }

  simpleToster(msg) {
    let toast = this.toaster.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }


}
