import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';

@IonicPage()
@Component({
  selector: 'page-view-modal',
  templateUrl: 'view-modal.html',
})
export class ViewModalPage {
  color: string;
  title: string;
  items: Array<any> = [];
  customer: string;
  method: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public viewCtrl: ViewController) {
  }

  ionViewWillLoad() {
    //Default parameter elements needed
    this.title = this.navParams.get('title');
    this.color = this.navParams.get('color');
    this.customer = this.navParams.get('customer');
    this.method = this.navParams.get('method');
    if (this.title == null) { this.title = 'Add Page'; }
    if (this.color == null) { this.color = 'primary'; }
  }

  back(){
    this.viewCtrl.dismiss(); 
  }

  ionViewDidLoad() {
    if (this.navParams.get('items')){
      this.items = this.navParams.get('items');
      console.log(this.items);
    }
  }

}
