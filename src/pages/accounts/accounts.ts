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
  account: any = {};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private utils: UtilsProvider,
              private database: DatabaseProvider,
              private json: JsonObjectsProvider) {
  }

  ionViewWillLoad() {
    this.account = JSON.parse(JSON.stringify(this.json.banking));
  }

  saveTotals() {
    let i = 0;
    this.temp_account.forEach(element => {
      if (element && element !== '') {
        if (i === 0) { this.prepareAccounts(element, 'cash'); }
        if (i === 1) { this.prepareAccounts(element, 'ecocash'); }
        if (i === 2) { this.prepareAccounts(element, 'purchase'); }
        if (i === 3) { this.prepareAccounts(element, 'other'); }
        let p = this.account.accounts.findIndex(i => i.name === "purchase");
        if (p !== -1) { this.account.accounts[p].transactions = [{ id: 1, amount: Number(this.temp_account[2])}]; }
      }
      i++;
      if (i === 3) {
        let d = new Date();
        this.account.at_date = d.getTime();
        if (this.temp_account[0] && this.temp_account[0] !== '' || this.temp_account[2] && this.temp_account[2] !== '') {
          this.database.setData('banking', this.account).then(v => {
            if (v) {
              this.addPurchase(d.getTime());
              let size = this.account.accounts.length;
              let msg = size + ' Account(s) Added';
              this.utils.simpleToster(msg, 'top');
              this.revert();
            }
          })
        } else {
          this.utils.simpleAlrt('Enter Cash and Purchases figures');
        }
      }
    });
  }

  prepareAccounts(total, name) {
    let accounts = JSON.parse(JSON.stringify(this.json.accounts));
    accounts.name = name;
    accounts.total = Number(total);
    this.account.accounts.push(accounts);
  }

  revert() {
    this.temp_account = [null, null, null, null];
    this.account.accounts = [];
    this.navCtrl.setRoot('HomePage');
  }

  addPurchase(date){
    let purchase_amount = Number(this.temp_account[2]);
    if(purchase_amount !== 0){
      let d = new Date(this.account.at_date);
      let code = d.toDateString().replace(/ /g, "-").toUpperCase();
      let purchase_instance: Array<any> = [];
      let transactions_instance: Array<any> = [];
      let purchase = JSON.parse(JSON.stringify(this.json.purchase));
      let transactions = JSON.parse(JSON.stringify(this.json.transactions));
      
      purchase.amount_in_base = purchase_amount;
      purchase.base_currency = 'USD';
      purchase.buying_currency = 'USD';
      purchase.purchase_code = 'CAP-' + code;
      purchase.id = 1;
      purchase.date = this.account.at_date;
      purchase.place = 'Shop';
      purchase_instance.push(purchase);
      //Populating Transaction object
      transactions.id = 1;
      transactions.date = date;
      transactions.to = 'purchases'
      transactions.amount = purchase_amount;
      transactions_instance.push(transactions);

      this.database.setData('purchases', purchase_instance);
      this.database.setData('transactions', transactions_instance);
      console.log('Databases Set, Purchases and Transactions');
      return true;
    }

  }
}
