import { Component, Input} from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { UtilsProvider } from '../../providers/utils/utils';
import { NavController } from 'ionic-angular/navigation/nav-controller';



@Component({
  selector: 'add-expense',
  templateUrl: 'add-expense.html'
})
export class AddExpenseComponent {
  @Input('expense') expense;
  expense_object: {} = {};
  //holding Expensive data in storage
  accounts_arr: Array<any> = [];

  acc: boolean = false;
  amnt: boolean = false;
  dat: boolean = false;
  cat: boolean = false;
  temp_arry: Array<any> = [];
  bank_instorage: any;

  amount: number = null;
  id: number = null;

  constructor(private database: DatabaseProvider,
              private utils: UtilsProvider,
              public navCtrl: NavController) {
  }

  ngAfterViewInit(){
    this.database.getData('expenses').then(v => {
      if (v) {
        this.temp_arry = v;
      }
    });
    this.expense_object = this.expense;
    this.database.getData('banking').then(value => {
      if (value) {
        this.bank_instorage = value;
        let i = 0;
        value.accounts.forEach(element => {
          this.accounts_arr.push(element.name);
          i++;
        });
      }
    });
  }

  transform(v){
   return this.utils.transform(v);
  }

  saveExpense(){
    this.expense.amount = Number(this.amount);
    this.expense.id = Number(this.temp_arry.length+1)
    let validate = this.validate(this.expense_object);
    if(validate){
      this.temp_arry.push(this.expense_object);
      console.log(this.temp_arry);
      this.database.setData('expenses', this.temp_arry).then(v =>{
        if(v){
          this.utils.simpleToster('Expense Added', 'top');
          //Now save to transaction Array And subtract the Amount
          this.recordTransaction(this.expense_object, this.expense.from_account);
        }
      })
    }
  }

  validate(obj){
    let c = 0;
    let d = new Date(obj.date)
    if (!obj.amount  || obj.amount === ''){ this.amnt = true;
    } else if (obj.amount && obj.amount !== '') { c++; }

    if (!obj.category || obj.category === '') { this.cat = true;
    } else if (obj.category && obj.category !== '') { c++;}

    if (!obj.date || obj.date === '') { this.dat = true;
    } else if (obj.date && obj.date !== '') { obj.date = d.getTime(); c++; }

    if (!obj.from_account || obj.from_account === '') { this.acc = true; 
    } else if (obj.from_account && obj.from_account !== '') { c++; }
    if(c === 4){
      return true
    }
  }

  d(){
    this.dat = false;
  }
  s() {
    this.cat = false
  }
  p() {
    this.acc = false
  }
  a() {
    this.amnt = false;
  }

  recordTransaction(obj, name) {
    console.log(this.bank_instorage.accounts);
    let bank = this.bank_instorage.accounts;
    bank.forEach(element => {
      if(element.name == name){
        console.log(element.total);
        console.log(obj.amount);
        if(element.total < obj.amount){
          console.log('That Can\'t happen');
          console.log(this.temp_arry);
          this.temp_arry.pop();
          console.log(this.temp_arry);
          this.database.setData('expenses', this.temp_arry).then(v => {
            if (v) {
              this.utils.simpleToster('Expense Removed', 'bottom');
              this.navCtrl.setRoot('HomePage');
            }
          })
        } else if (element.total > obj.amount) {
          //subtract current Amount
          element.transactions.push(obj);
          element.total = element.total - obj.amount;
          this.database.setData('banking', this.bank_instorage).then(val=>{
            if(val){
              this.utils.simpleToster('Expense Added', 'top');
              console.log(this.bank_instorage);
              this.navCtrl.setRoot('HomePage');
            }
          })
        }
      }
    });
  }

  deleteElement(Arr: Array<any>, id){
    Arr.forEach(element => {
      if(element.id === id){
        element.slice(1)
      }
    });
  }
}
