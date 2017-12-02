import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-expenses',
  templateUrl: 'expenses.html'
})
export class ExpensesPage {

  constructor(public navCtrl: NavController) {
  }
  goToPlaceholder(params){
    if (!params) params = {};
    this.navCtrl.push('PlaceholderPage');
  }
}
