import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-banking',
  templateUrl: 'banking.html',
})
export class BankingPage {
  cash: number = 0;
  ecocash: number = 0;

  constructor(public navCtrl: NavController,
       public navParams: NavParams, 
       public alertCtrl: AlertController,
       private database: DatabaseProvider
      ) {
  }

  ionViewDidLoad() {
    this.database.getData('banking').then(val => {
      if (val) {
        this.cash = val.cash;
        this.ecocash = val.ecocash;
      } else {
        this.navCtrl.setRoot('UserinfoPage');
      }
    });
  }
  addAccount(){
    let alert = this.alertCtrl.create({
      subTitle: 'To add Accounts Upgrade to Cashflow Premium on (https://play.google.com/store/apps/dev?id=5700313618786177705456).',
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
