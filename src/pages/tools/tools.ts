import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-tools',
  templateUrl: 'tools.html'
})
export class ToolsPage {

  constructor(public navCtrl: NavController) {
  }
  goToCalculator(params) {
    if (!params) params = {};
    this.navCtrl.push('CalculatorPage');
  }
  goToCurrency(params) {
    if (!params) params = {};
    this.navCtrl.push('CurrencyPage');
  }
  goToPlaceholder(params){
    if (!params) params = {};
    this.navCtrl.push('PlaceholderPage');
  }
  goToSettings(params){
    if (!params) params = {};
    this.navCtrl.push('SettingsPage');
  }

  ionViewDidLoad() {
    console.log('Tools Page')
  }
}
