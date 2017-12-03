import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { DatabaseProvider } from '../../providers/database/database';
import { JsonObjectsProvider } from '../../providers/json-objects/json-objects';

@IonicPage()
@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage {
  temp_account: Array<any> = [null, null, null, null];
  account: {
    at_date: number,
    accounts: Array<any>
  } = {
      at_date: 1512119464780,
      accounts: []
    };


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private utils: UtilsProvider,
              private database: DatabaseProvider,
              private json: JsonObjectsProvider) {
  }

  ionViewWillLoad() {
    console.log('ionViewDidLoad AccountsPage');
  }
  ionViewWillLeave(){
    console.log('ionViewWillLeave AccountsPage');
    this.utils.showLoader('Wait...');
  }

  saveTotals() {
    let i = 0;
    this.temp_account.forEach(element => {
      if (element && element !== '') {
        if (i === 0) { this.prepareAccounts(element, 'cash'); }
        if (i === 1) { this.prepareAccounts(element, 'ecocash'); }
        if (i === 2) { this.prepareAccounts(element, 'purchase'); }
        if (i === 3) { this.prepareAccounts(element, 'other'); }
      }
      i++;
      if (i === 3) {
        let d = new Date;
        this.account.at_date = d.getTime();
        if (this.temp_account[0] && this.temp_account[0] !== '' || this.temp_account[2] && this.temp_account[2] !== '') {
          this.database.setData('banking', this.account).then(v => {
            if (v) {
              this.addPurchase();
              let size = this.account.accounts.length;
              let msg = size + ' Account(s) Added';
              this.utils.simpleToster(msg, 'top');
              this.revert();
            }
          })
        } else {
          this.utils.simpleAlrt('Enter Cash and/ Purchases');
        }
      }
    });
  }

  prepareAccounts(total, name) {
    let accounts: {
      name: string, total: number, transactions: Array<any>
    } = { name: '', total: null, transactions: [] }
    accounts.name = name;
    accounts.total = Number(total);
    this.account.accounts.push(accounts);
  }

  revert() {
    this.temp_account = [null, null, null, null];
    this.account.accounts = [];
    this.navCtrl.setRoot('HomePage');
  }

  addPurchase(){
    let d = new Date(this.account.at_date);
    let code = d.toDateString().replace(/ /g, "-").toUpperCase();
    let purchase_amount = Number(this.temp_account[2]);
    let instance: Array<any> = [];
    let purchase = JSON.parse(JSON.stringify(this.json.purchase));

    if(purchase_amount !== 0){
      purchase.amount_in_base = purchase_amount;
      purchase.base_currency = 'USD';
      purchase.buying_currency = 'USD';
      purchase.purchase_code = 'CAPITAL-' + code;
      purchase.id = 1;
      purchase.date = this.account.at_date;
      instance.push(purchase);
      this.database.setData('purchases', instance).then(v=>{
        if(v){
          console.log(instance);
          console.log('Capital Purchase Added');
        }
      })
    }

  }
}
