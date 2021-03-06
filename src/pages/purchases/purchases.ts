import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { UtilsProvider } from '../../providers/utils/utils';
import { DatePipe } from '@angular/common/src/pipes/date_pipe';


@IonicPage()
@Component({
  selector: 'page-purchases',
  templateUrl: 'purchases.html',
})
export class PurchasesPage {
  //stores purchases in storage
  purchases_instorage: Array<any> = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private database: DatabaseProvider,
              private utils: UtilsProvider) {
  }

  ionViewWillLoad() {
    console.log('ionViewDidLoad PurchasesPage');
    this.database.getData('purchases').then(val=>{
      this.purchases_instorage = val.reverse();
      console.log(val);
    })
  }


  addPurchase() {
    this.utils.showLoader('Wait...')
    this.navCtrl.push('AddPage', {
      title: 'Add Purchase',
      color: 'primary',
      addthing: 'addPurchase'
    });
  }

}
