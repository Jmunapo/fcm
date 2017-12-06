import { Component, Input } from '@angular/core';
import { RemoteProvider } from '../../providers/remote/remote';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { UtilsProvider } from '../../providers/utils/utils';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { JsonObjectsProvider } from '../../providers/json-objects/json-objects';

@Component({
  selector: 'add-purchase',
  templateUrl: 'add-purchase.html'
})
export class AddPurchaseComponent {
  @Input('purchase') purchase;
  purchases_instorage: Array<any> = [];
  //for validation and error display
  amnt: boolean;
  dat: boolean;
  plc: boolean;
  //Dom models
  place: string;
  date: string;
  amount: any = 0;
  amount_in_usd: any;
  currency_name: string = "USD"; //currecy name
  currency_code: string = "USD"; //currecy code
  //Holds Currecy Array to display
  currency: Array<any> = [];
  //to display accounts in dom without purchase account
  dom_accounts_array: Array<any> = [];
  //To hold banking Object
  banking_instorage: any = {};
  //To hold Acounts Array
  accounts_instorage: any;
  //To get selected item index
  dom_accounts_index: Array<any> = [];
  //Store transaction details to record on Done
  temp_transaction_array: Array<any> = [];
  transactions_instorage: Array<any> = [];

 

  constructor(private remote: RemoteProvider,
              private database: DatabaseProvider,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController,
              private utils: UtilsProvider,
              private alertCtrl: AlertController,
              private json: JsonObjectsProvider) {           }
  ngAfterViewInit() {
    this.amount_in_usd = this.amount;
    this.currency = [{ name: 'USD', code: 'USD' },
    { name: 'Rand', code: "ZAR" },
    { name: 'Kwacha', code: 'ZMW' },
    { name: 'Pula', code: 'BWP' },
    { name: 'Metical', code: 'MZN' }];

    this.database.getData('banking').then(f => {
      if (f) {
        this.banking_instorage = f;
        this.accounts_instorage = f.accounts;
        let accounts = this.accounts_instorage;
        for (let i = 0; i < accounts.length; i++) {
          if (accounts[i].name !== 'purchase') {
            this.dom_accounts_array.push(accounts[i]);
          }
        }
      }
    });
    this.database.getData('transactions').then(t => {
      if (t) {
        this.transactions_instorage = t;
      }
    });

    this.database.getData('purchases').then(p => {
      if (p) {
        this.purchases_instorage = p;
      }
    });
  }

  process_purchase(){
    let validated = this.validate_fields()
    if (validated){
      this.utils.showLoader('Processing');
      let inserted = this.insert_trans_id();
      if (inserted) {
        let code_created = this.create_code();
        if (code_created){
          let id = this.purchases_instorage.length + 1;
          let d = new Date(this.date)

          this.purchase.buying_currency = this.currency_code;
          this.purchase.date = d.getTime();
          this.purchase.purchase_code = code_created;
          this.purchase.amount_in_base = this.amount_in_usd;
          this.purchase.place = this.place;
          this.purchase.id = id;
          this.purchases_instorage.push(this.purchase);
          //Seting Values
          this.database.setData('purchases', this.purchases_instorage);
          this.database.setData('transactions', this.transactions_instorage);
          this.database.setData('banking', this.banking_instorage);
          console.log('Databases Set, Purchases, Transactions And Banking');
          this.utils.simpleToster('Saved', 'top');
          this.navCtrl.pop();
        }
      }
    }
  }

  create_code(){
    let d = new Date(this.date)
    let code_date = d.toDateString().replace(/ /g, '-').toUpperCase();
    let wordArray = [];
    wordArray = this.place.split(" ");
    if (wordArray.length === 1) {
      let word = wordArray[0];
      if (word.length < 4) {
        let my_word = word.toUpperCase();
        let my_code = my_word + '-' + code_date;
        return my_code;
      } else {
        let my_word = word.slice(0, 3).toUpperCase();
        let my_code = my_word + '-' + code_date;
        return my_code;
      }
    } else if (wordArray.length > 1) {
      let word = '';
      let c = 0;
      for (let i = 0; i < wordArray.length; i++) {
        let my_word = wordArray[i].charAt(0);
        word = word + my_word;
        c++
        if (c == wordArray.length) {
          let my_code = (word + '-' + code_date).toUpperCase()
          return my_code;
        }
      }
    }
    return false;
  }
  insert_trans_id(){
    let amount = this.amount_in_usd;
    let id = this.transactions_instorage.length + 1;
    let arr = this.temp_transaction_array;
    for (let i = 0; i < arr.length; i++){
      let name = arr[i].name;
      let acc_amount = arr[i].credited;
      let b = this.banking_instorage.accounts.findIndex(f => f.name === name);
      if (b !== -1) { this.banking_instorage.accounts[b].transactions.push({ id: id, amount: acc_amount })}
    }
    //Adding to purchase account
    let p = this.banking_instorage.accounts.findIndex(a => a.name === 'purchase');
    if (p !== -1) { 
      this.banking_instorage.accounts[p].total = this.banking_instorage.accounts[p].total + amount;
      this.banking_instorage.accounts[p].transactions.push({ id: id, amount: this.amount_in_usd })}

    //Saving transaction history
    let transactions = JSON.parse(JSON.stringify(this.json.transactions));
    let d = new Date(this.date);
    transactions.id = id;
    transactions.date = (d.getTime());
    transactions.to = 'purchases'
    transactions.amount = amount;
    this.transactions_instorage.push(transactions);
    return true;
  }


  //show the popup to get amount from the user
  credited_account(index, name){
    let check_dom = this.dom_accounts_index[index];
    if (check_dom) {
      this.currency_code = 'USD';
      this.currency_name = 'USD';
      this.amount = this.amount_in_usd;
      this.get_credited_amount(index, name, '');
    } else if (!check_dom){
      this.currency_code = 'USD';
      this.currency_name = 'USD';
      this.amount = this.amount_in_usd;
      this.remove_credited_amount(name);
    }
  }

  remove_credited_amount(name){
  let temp = this.temp_transaction_array;
  for (let i = 0; i < temp.length; i++) {
    if (temp[i].name === name) {
      let credited = temp[i].credited;
      let b = this.banking_instorage.accounts.findIndex(f => f.name === name);
      if (b !== -1) { this.banking_instorage.accounts[b].total = this.banking_instorage.accounts[b].total + credited; }
      this.amount = this.amount-credited;
      this.amount_in_usd = this.amount;
      this.temp_transaction_array.splice(i, 1);
    }
  }
}

  calculate_credited_amount(name, amount){
    //name is account name
    //amount is amount in usd  the credited amount which is in USD
    //dom_val could be amount in usd or converted amount basically the one that displayed to the user
    let accounts = this.accounts_instorage;
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].name === name) {
        let acc_balance = accounts[i].total;
        if (acc_balance < amount) {
          return false;
        } else if (acc_balance >= amount) {
          this.banking_instorage.accounts[i].total = acc_balance-amount;
          let transacton = { name: name, credited: Number(amount)}
          this.amount = this.amount + amount;
          this.amount_in_usd = this.amount_in_usd + amount;
          this.temp_transaction_array.push(transacton);
          return true;
        }
      }
    }
  }

  get_credited_amount(index, name, err) {
    let prompt = this.alertCtrl.create({
      title: 'From ' + name + ' Account',
      message: err,
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'credit',
          type: 'number',
          placeholder: name + ' $'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            this.dom_accounts_index[index] = false;
          }
        },
        {
          text: 'Credit',
          handler: data => {
            let credit_amnt = Number(data.credit);
            if (credit_amnt === 0) {
              this.get_credited_amount(index, name, 'Enter amount');
            } else if (credit_amnt !== 0) {
              let compare = this.calculate_credited_amount(name, credit_amnt);
              if (compare){
                this.amnt = false;
              }else if(!compare){
                this.get_credited_amount(index, name, 'Overdraft');
              }
            }
          }
        }
      ]
    });
    if(this.currency_code !== 'USD'){
      this.currency_code = 'USD';
      this.currency_name = 'USD';
      prompt.present();
    }else if(this.currency_code === 'USD'){
      prompt.present();
    }
  }

  currecy_converter(){
    let loader = this.loadingCtrl.create({
      content: 'Converting',
      duration: 9000,
      spinner: 'bubbles',
    });
    let fromto = 'USD_' + this.currency_code;
    loader.present();
    this.remote.retrieveOne(fromto).subscribe(v => {
      if (v) {
        let rate = v.val;
        this.purchase.rate = rate;
        this.purchase.buying_currency = this.currency_code;
        this.amount = Number((this.amount_in_usd * rate).toFixed(2));
        loader.dismiss();
      }
    }, err => {
      this.currency_code = 'USD';
      this.currency_name = 'USD';
      this.utils.simpleToster('You are not connected to the internet! Save in USD', 'middle')
      loader.dismiss();
    });
  }
  currency_changed(code) {
    if(code !=='USD'){
      this.currency_code = code;
      this.currecy_converter();
    }else{
      //Change back to USD to Avoid more conversion
      this.amount = this.amount_in_usd;
    }
  }
  validate_fields(){
      let c = 0;
      if (this.amount === 0) {
        this.amnt = true;
      } else if (this.amount !== 0) { c++; }

      if (!this.date) {
        this.dat = true;
      } else if (this.date) {
        let d = new Date(this.date)
        this.purchase.date = d.getTime();
        c++;
      }

      if (!this.place || this.place === '') {
        this.plc = true;
      } else if (this.place && this.place !== '') { c++; }
      if (c === 3) {
        return true;
      }
      return false;
  }
  remove_err(err){
    if (err === 'dat') { this.dat = false; }
    if (err === 'amnt') { this.amnt = false; }
    if (err === 'plc') { this.plc = false; }
  }
}
