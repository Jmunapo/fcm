import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { DatePipe } from '@angular/common/src/pipes/date_pipe';

@IonicPage()
@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html'
})
export class ExpensesPage {
  selected_expense: string = '';
  expense_category: Array<string> = ['All Expenses'];
  expenses_instorage: Array<any> = [];
  transactions: Array<any> = [];

  constructor(public navCtrl: NavController,
              private database: DatabaseProvider) {
  }
  ionViewWillLoad(){
    this.selected_expense = this.expense_category[0];
    this.database.getData('expenses').then(data=>{
      if(data){
        for (let i = 0; i < data.length; i++) {
          let exp = data[i].spent_on;
          let b = this.expense_category.findIndex(f => f === exp);
          if (b === -1) {
            this.expense_category.push(data[i].spent_on);
          }
        }
        this.expenses_instorage = data;
        console.log(this.expenses_instorage);
      }
    });
  }
  ionViewDidLoad(){
    this.database.getData('transactions').then(data=>{
      if(data){
        this.transactions = data.filter(function (item) {
          return item.to === 'expenses';
        });
        console.log(this.transactions);
      }
    })
  }
  selected(){
    let slct = this.selected_expense;
    console.log(slct);
    this.database.getData('expenses').then(data=>{
     if (slct === 'All Expenses') {
        this.expenses_instorage = data;
     } else {
        this.expenses_instorage = data.filter(function (item) {
          return item.spent_on === slct;
        });
      }
    });
  }

  get_total(id){
    let trans = this.transactions;
    if (trans.length !== 0) {
      let total_elem = trans.filter(function (item) {
        return item.id === id;
      });
      return total_elem[0].amount;
    }
  }

  addExpense(title, color, addthing){
    this.navCtrl.push('AddPage', {
      title: title,
      color: color,
      addthing: addthing
    });
  }
}
