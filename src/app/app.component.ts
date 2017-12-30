import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseProvider } from '../providers/database/database';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;

  rootPage: any = 'AddPage';
  constructor(platform: Platform, statusBar: StatusBar,
     splashScreen: SplashScreen, 
     private database: DatabaseProvider) {
    platform.ready().then(() => {
      /*this.database.getData('banking').then(val=>{
        if(val){
          this.rootPage = 'HomePage';
        }else{
          this.rootPage = 'AccountsPage';
        }
      });

      platform.registerBackButtonAction(() => {
        if (this.navCtrl.canGoBack()) {
          this.navCtrl.pop();
        } else {
          let curr = this.navCtrl.getActive().name;
          if(curr !== 'Homepage'){
            this.rootPage = 'HomePage';
          }else{
            platform.exitApp();
          }
        }
      });*/
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }



  goHome(params) {
    if (!params) params = {};
    this.navCtrl.setRoot('HomePage');
  }
  goToDashboard(params) {
    if (!params) params = {};
    this.navCtrl.setRoot('DashboardPage');
  }
  goToBanking(params) {
    if (!params) params = {};
    this.navCtrl.setRoot('BankingPage');
  }

  goToStock(params){
    if (!params) params = {};
    this.navCtrl.setRoot('StockPage');
  }

  goToSales(params){
    if (!params) params = {};
    this.navCtrl.setRoot('SalesPage');
  }
  goToPurchases(params) {
    if (!params) params = {};
    this.navCtrl.setRoot('PurchasesPage');
  }
  goToInventory(params){
    if (!params) params = {};
    this.navCtrl.setRoot('InventoryPage');
  }
  goToExpenses(params){
    if (!params) params = {};
    this.navCtrl.setRoot('ExpensesPage');
  }
  goToPlaceholder(params){
    if (!params) params = {};
    this.navCtrl.setRoot('PlaceholderPage');
  }
  goToSettings(params){
    if (!params) params = {};
    this.navCtrl.setRoot('SettingsPage');
  }
}
