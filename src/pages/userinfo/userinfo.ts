import { ViewChild, Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-userinfo',
  templateUrl: 'userinfo.html',
})
export class UserinfoPage {
  @ViewChild(Slides) slides: Slides;

  account: {
    at_date: number,
    accounts: Array<any>
  } = {
      at_date: 1512119464780,
      accounts: []
    };
  
  temp_account: Array<any> = [null,null,null,null];
  baseCurrency: string;
  checkLoopNum: number = 0;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public modal: ModalController,
    private database: DatabaseProvider,
    private utils: UtilsProvider ) {
    
  }

  ionViewWillLoad() {
    this.utils.showLoader('Wait...');
    this.slides.lockSwipeToNext(true);
    this.database.getData('banking').then(val => {
      if (val) {
        this.navCtrl.setRoot('HomePage');
      }
    });
  }

 //Saving User Accounts Details to the database
  saveTotals(){
    let i = 0;
    this.temp_account.forEach(element => {
      if (element && element !== ''){
        if (i === 0) {this.prepareAccounts(element, 'cash');}
        if (i === 1) {this.prepareAccounts(element, 'ecocash');}
        if (i === 2) {this.prepareAccounts(element, 'purchase'); }
        if (i === 3) {this.prepareAccounts(element, 'other');}
      }
      i++;
      if(i === 3){
        let d = new Date;
        this.account.at_date = d.getTime();
        if (this.temp_account[0] && this.temp_account[0] !== '' || this.temp_account[2] && this.temp_account[2] !== ''){
          this.database.setData('banking', this.account).then(v => {
            if(v){
              let size = this.account.accounts.length;
              let msg = size + ' Account(s) Added';
              this.utils.simpleToster(msg, 'top');
              this.revert();
              this.slides.lockSwipeToNext(false);
              this.slides.slideTo(2, 500);
              this.slides.lockSwipeToNext(true);
            }
          })
        }else{
          this.utils.simpleAlrt('Enter Cash and/ Purchase');
        }
      }
    });
  }

  prepareAccounts(total, name) {
    let accounts: { name: string, total: number, transactions: Array<any> 
    } = {name: '', total: null, transactions: [] }
    accounts.name = name;
    accounts.total = Number(total);
    this.account.accounts.push(accounts);
  }

  revert(){
    this.account.accounts = [];
  }
  ionViewDidLoad() {
    this.baseCurrency = 'USD';
  }
  
  begin(){
    this.slides.lockSwipeToNext(false);
    this.slides.slideTo(1, 500);
    this.slides.lockSwipeToNext(true);
  }

  getIn(){
      this.database.getData('banking').then(val => {
        if (val) {
          this.navCtrl.setRoot('HomePage');
        } else {
          this.begin();
        }
      });
    }
}
