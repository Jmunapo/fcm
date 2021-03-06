import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController) {
  }
  goToPlaceholder(params){
    if (!params) params = {};
    this.navCtrl.push('PlaceholderPage');
  }
}
