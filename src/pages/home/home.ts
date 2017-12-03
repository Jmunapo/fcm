import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { UtilsProvider } from '../../providers/utils/utils';
import { Events } from 'ionic-angular/util/events';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { JsonObjectsProvider } from '../../providers/json-objects/json-objects';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  accounts: Array<any>;
  sales: number;
  profit: number;
  expenses: number;
  value: number;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private database: DatabaseProvider,
    private utils: UtilsProvider,
    private modal: ModalController,
    private events: Events,
    private json: JsonObjectsProvider) {
    this.events.subscribe('Home', () => {
      this.addProductsAdd();
    })
  }

  ionViewWillLoad() {
    this.database.getData('banking').then(val =>{
      if(val){
        this.accounts = val.accounts;
        this.calcTotal(this.accounts);
        console.log(val);
      }else {
       this.navCtrl.setRoot('UserinfoPage');
      }
    });
  }

  ionViewDidLoad() {
    this.database.getData('products').then(val => {
      let temp = this;
      if (!val) {
        setTimeout(function () {
          temp.utils.showConfAlrt('Welcome', 'Add Products to start', 'Add', 'Not Now', 'Home');
        }, 5000)
      }
    });
  }

  calcTotal(array){
    let total = 0;
    let expenses = 0;
    array.forEach(element => {
      console.log(element);
      total = total+element.total;
      for (let i = 0; i < element.transactions.length; i++){
        let elem = element.transactions[i];
        expenses = expenses+elem.amount;
      }
    });
    console.log(array)
    this.value = total;
    this.expenses = Number((expenses).toFixed(1));
    this.sales = Number((0).toFixed(1));
    this.profit = Number((0).toFixed(1));
  }
  goToAdd(params,col, add) {
    this.utils.showLoader('Wait...')
    this.navCtrl.push('AddPage', {
      title: params,
      color: col,
      addthing: add
    });
  }

  goToTools(params){
    this.navCtrl.setRoot('ToolsPage');
  }

  addProductsAdd() {
    this.utils.showLoader('Wait...')
    this.navCtrl.push('AddPage', {
      title: 'Add Product',
      addthing: 'AddProduct'
    });
  }

  addProducts() {
    let data = this.json.product;
    console.log(data);
    const product = this.modal.create('ModalsPage', {title: 'Add Products', product: data }, { enableBackdropDismiss: false });
    product.present();
    product.onDidDismiss(data => {
      if (data != '') {
        console.log(data);
        this.database.setData('products', data).then(val => {
          let msg = data.length + ' Product(s) Added';
          this.utils.simpleToster(msg, 'top');
        });
      }
    });
  }

}
