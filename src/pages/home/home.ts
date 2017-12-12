import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { UtilsProvider } from '../../providers/utils/utils';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { JsonObjectsProvider } from '../../providers/json-objects/json-objects';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  accounts: Array<any>;
  expense_instorage: Array<any>;
  sales: number = 0;
  profit: number = 0;
  expenses: number = 0;
  value: number;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private database: DatabaseProvider,
    private utils: UtilsProvider,
    private modal: ModalController,
    private json: JsonObjectsProvider) {

  }

  ionViewWillLoad() {
    this.database.getData('banking').then(val =>{
      if(val){
        this.accounts = val.accounts;
        this.calcTotal(this.accounts);
      }else {
        this.navCtrl.setRoot('AccountsPage');
      }
    });

    this.database.getData('expenses').then(v => {
      if (v) {
        this.expense_instorage = v;
        this.calculate_expens(v);

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

  calculate_expens(v){
    let e = 0;
    let c = v.length;
    for(let i = 0; i<v.length; i++){
      let element = v[i];
      e = e + element.amount
      if(i+1 === c){
        this.expenses = e;
      }
    }
  }

  calcTotal(array){
    let total = 0;
    let c = 0;
    array.forEach(element => {
      total = total+element.total;
      c++;
    });
    if(c === array.length){
      this.value = total;
    }
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
