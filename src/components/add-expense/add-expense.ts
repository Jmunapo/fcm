import { Component, Input } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { UtilsProvider } from '../../providers/utils/utils';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { JsonObjectsProvider } from '../../providers/json-objects/json-objects';



@Component({
  selector: 'add-expense',
  templateUrl: 'add-expense.html'
})
export class AddExpenseComponent {
  @Input('expense') expense;

  expenses_instorage: Array<any> = [];
  //for validation and error display
  amnt: boolean;
  dat: boolean;

  //Dom models
  transacrion_id: number;
  spent_on: string;
  description: string = '';
  date: string;
  amount: any = 0;
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

  expense_category: Array<any> = [];





  constructor(private database: DatabaseProvider,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private utils: UtilsProvider,
    private alertCtrl: AlertController,
    private json: JsonObjectsProvider) { }
  ngAfterViewInit() {
    this.expense_category = this.json.expense_category;
    this.spent_on = this.expense_category[0];
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

    this.database.getData('expenses').then(p => {
      if (p) {
        this.expenses_instorage = p;
      }
    });
  }

  save_expense() {
    let validated = this.validate_fields()
    if (validated) {
      this.utils.showLoader('Processing');
      let inserted = this.insert_trans_id();
      console.log(inserted);
      if (inserted) {
        let id = this.expenses_instorage.length + 1;
        let d = new Date(this.date)

        this.expense.amount = this.amount;
        this.expense.date = d.getTime();
        this.expense.description = this.description;
        this.expense.spent_on = this.spent_on;
        this.expense.transaction_id = this.transacrion_id;
        this.expense.id = id;
        this.expenses_instorage.push(this.expense);
        //Seting Values
        this.database.setData('transactions', this.transactions_instorage);
        this.database.setData('banking', this.banking_instorage);
        this.database.setData('expenses', this.expenses_instorage).then(ex=>{
          if(ex){
            console.log('Databases Set, Expenses, Transactions And Banking');
            this.utils.simpleToster('Saved', 'top');
            this.navCtrl.setRoot('HomePage');
          }
        })
      }
    }
  }

  insert_trans_id() {
    let amount = this.amount;
    this.transacrion_id = this.transactions_instorage.length + 1;
    let arr = this.temp_transaction_array;
    for (let i = 0; i < arr.length; i++) {
      let name = arr[i].name;
      let acc_amount = arr[i].credited;
      let b = this.banking_instorage.accounts.findIndex(f => f.name === name);
      if (b !== -1) { this.banking_instorage.accounts[b].transactions.push({ id: this.transacrion_id, amount: acc_amount }) }
      }
    //Saving transaction history
    let transactions = JSON.parse(JSON.stringify(this.json.transactions));
    let d = new Date(this.date);
    transactions.id = this.transacrion_id ;
    transactions.date = (d.getTime());
    transactions.to = 'expenses'
    transactions.amount = amount;
    this.transactions_instorage.push(transactions);
    return true;
  }


  //show the popup to get amount from the user
  credited_account(index, name) {
    let check_dom = this.dom_accounts_index[index];
    if (check_dom) {
      this.get_credited_amount(index, name, '');
    } else if (!check_dom) {
      this.remove_credited_amount(name);
    }
  }

  remove_credited_amount(name) {
    let temp = this.temp_transaction_array;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].name === name) {
        let credited = temp[i].credited;
        let b = this.banking_instorage.accounts.findIndex(f => f.name === name);
        if (b !== -1) { this.banking_instorage.accounts[b].total = this.banking_instorage.accounts[b].total + credited; }
        this.amount = this.amount - credited;
        this.temp_transaction_array.splice(i, 1);
      }
    }
  }

  calculate_credited_amount(name, amount) {
    let accounts = this.accounts_instorage;
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].name === name) {
        let acc_balance = accounts[i].total;
        if (acc_balance < amount) {
          return false;
        } else if (acc_balance >= amount) {
          this.banking_instorage.accounts[i].total = acc_balance - amount;
          let transacton = { name: name, credited: Number(amount) }
          this.amount = this.amount + amount;
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
              if (compare) {
                this.amnt = false;
              } else if (!compare) {
                this.get_credited_amount(index, name, 'Overdraft');
              }
            }
          }
        }
      ]
    });
      prompt.present();
  }

  validate_fields() {
    let c = 0;
    if (this.amount === 0) {
      this.amnt = true;
    } else if (this.amount !== 0) { c++; }

    if (!this.date) {
      this.dat = true;
    } else if (this.date) {
      let d = new Date(this.date)
      this.expense.date = d.getTime();
      c++;
    }
    if (c === 2) {
      return true;
    }
    return false;
  }
  remove_err(err) {
    if (err === 'dat') { this.dat = false; }
    if (err === 'amnt') { this.amnt = false; }
  }
}
