import { Component, Input} from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { UtilsProvider } from '../../providers/utils/utils';



@Component({
  selector: 'add-expense',
  templateUrl: 'add-expense.html'
})
export class AddExpenseComponent {
  @Input('expense') expense;
  expense_object: {} = {};
  accounts_arr: Array<any> = [];

  acc: boolean = false;
  amnt: boolean = false;
  dat: boolean = false;
  cat: boolean = false;
  temp_arry: Array<any> = [];

  amount: number = null;

  constructor(private database: DatabaseProvider,
              private utils: UtilsProvider) {
    console.log('AddExpenseComponent');
  }
  ionViewWillLoad() {
    this.database.getData('expenses').then(v=>{
      if(v){
        this.temp_arry = v;
      }
    })
  }
  ngAfterViewInit(){
    this.expense_object = this.expense;
    this.database.getData('banking').then(value => {
      if (value) {
        let i = 0;
        value.accounts.forEach(element => {
          this.accounts_arr.push(element.name);
          i++;
        });
        if (i === value.length) {
          console.log('Data Loaded');
        }
      }
    });
  }

  transform(v){
   return this.utils.transform(v);
  }

  saveExpense(){
    this.expense.amount = Number(this.amount);
    let validate = this.validate(this.expense_object);
    if(validate){
      console.log('Implemantation Started');
      console.log(this.expense_object);
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

    console.log(c);
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



}
