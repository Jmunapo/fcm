import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { UtilsProvider } from '../../providers/utils/utils';
import { Events } from 'ionic-angular/util/events';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';


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
    private events: Events) {
    events.subscribe('Home', () => {
      this.addProducts();
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
      if (!val) {
        let temp = this;
        setTimeout(function () {
          temp.utils.showConfAret('Welcome', 'Add Products to start', 'Add', 'Not Now', 'Home');
        }, 5000)
      }
    });
  }

  calcTotal(array){
    array.forEach(element => {
      
    });
    console.log(array)
    let cash = Number(array[0].total);
    let ecocash = Number(array[0].total);
    this.value = Number(cash + ecocash);
    this.expenses = Number((this.value * 0.05).toFixed(1));
    this.sales = Number((this.value + this.expenses).toFixed(1));
    this.profit = Number((this.value/3.12).toFixed(1));
  }
  goToAdd(params,col, add) {
    this.navCtrl.push('AddPage', {
      title: params,
      color: col,
      addthing: add
    });
  }

  goToTools(params){
    this.navCtrl.setRoot('ToolsPage');
  }

  addProducts() {
    const product = this.modal.create('ModalsPage', {title: 'Add Products' }, { enableBackdropDismiss: false });
    product.present();
    product.onDidDismiss(data => {
      if (data != '') {
        let nowLen = data.length;
        console.log(data);
        this.database.setData('products', data).then(val => {
          let msg = data.length + ' Product(s) Added';
          this.utils.simpleToster(msg, 'top');
        });
      }
    });
  }

}
