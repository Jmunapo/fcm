import { Component } from '@angular/core';
import { AlertController, LoadingController, IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database'
import { RemoteProvider } from '../../providers/remote/remote'

@IonicPage()
@Component({
  selector: 'page-currency',
  templateUrl: 'currency.html',
})
export class CurrencyPage {
  currency: string = "USD";
  amount: number;
  usdollar: number;
  rand: number;
  metical: number;
  pula: number;
  kwacha: number;
  bitcoin: number;
  date: string;
  databaseArr: { date: number, conversionData: Array<any>} = {
    date: 1511300000000,
    conversionData: []
  };

  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loader: LoadingController,
    private database: DatabaseProvider,
    private remote: RemoteProvider,
    public toaster: ToastController,
    public alertCtrl: AlertController ) {
        this.usdollar = 0.00;
        this.rand = 0.00;
        this.metical = 0.00;
        this.pula = 0.00;
        this.kwacha = 0.00;
        this.bitcoin = 0.00;
        this.amount = 1;
        this.date = ''
  }

  ionViewDidLoad() {
    this.convert();
  }

  async convert(){
    //this.database.removeData(this.currency); //clearing saved currency history
    this.database.getData(this.currency).then(val => {
      if(val){
        let dt1 = new Date(val['date']);
        let d = new Date();
        let diff = this.diff_hours(dt1, d);
        this.date = dt1.toDateString();
        if(diff > 3){
          this.getConversion(this.currency, val['conversionData']);
        }else{
          this.extractConversion(val['conversionData'])
        }
      }else if(!val){
        this.getConversion(this.currency, null)
      }
    });
  }

  async getConversion(currency, check: any = null){
    let loader = this.loader.create({
      content: 'Please wait...',
      duration: 6000
    });
    let d = new Date();
    this.date = d.toDateString();
    loader.present();
    let currArray: Array<string> = [];
    currArray = [
      this.currency + '_USD',
      this.currency + '_ZAR',
      this.currency + '_MZN',
      this.currency + '_BWP',
      this.currency + '_ZMW',
      this.currency + '_BTC']
    let convLen = currArray.length;
    let presentErr = currArray.length;
    await currArray.forEach(async (num) => {
      await this.remote.retrieveCurrency(num, convLen).subscribe(val => {
        if (val) {
          let nowTime = d.getTime();
          this.databaseArr.date = nowTime;
          this.databaseArr.conversionData = val;
          this.database.setData(currency, this.databaseArr).then(value => {
            if(value){
              this.extractConversion(this.databaseArr.conversionData);
              loader.dismiss();
            }
          });
        }
      },
        (err) =>{
          presentErr--;
          if(presentErr == 0){
            loader.dismiss();
            if(!check){
            let toast = this.toaster.create({
              message: 'Your internet connection appears to be offline',
              position: 'middle',
              showCloseButton: true,
              closeButtonText: 'Ok'
            });
            toast.present();
            }else if(check != null){
              let toast = this.toaster.create({
                message: 'No internet connection, Old data used instead. Check date below.',
                position: 'top',
                duration: 3000
              });
              toast.present();
              this.extractConversion(check);
            }
          }
        });
    })
  }
  
  extractConversion(convers: Array<any>) {
    convers.forEach(element => {
     this.objectKeys(element).then(val =>{
       let elemArray = element[val[0]];
       if (elemArray.to == 'ZAR') { this.rand = Number((this.amount * elemArray.val).toFixed(5)); }
       if (elemArray.to == 'USD') { this.usdollar = Number((this.amount * elemArray.val).toFixed(5)); }
       if (elemArray.to == 'BTC') { this.bitcoin = Number((this.amount * elemArray.val).toFixed(5)); }
       if (elemArray.to == 'ZMW') { this.kwacha = Number((this.amount * elemArray.val).toFixed(5)); }
       if (elemArray.to == 'BWP') { this.pula = Number((this.amount * elemArray.val).toFixed(5)); }
       if (elemArray.to == 'MZN') { this.metical = Number((this.amount * elemArray.val).toFixed(5)); }
     })
    });
  }

  async objectKeys(element){
    return Object.keys(element).filter(function (key) {
      let elem = element[key];
      return elem;
    });
  }

  whatIs(currency){
    if (currency == 'ZAR') { 
      let content = 'The South African rand (sign: R; code: ZAR) is the currency of South Africa. 1 Rand is subdivided into 100 cents (sign: "c")';
      this.showCurrency('Rand', content);
  }
    if (currency == 'USD') { 
      let content = 'The United States dollar (sign: $; code: USD; also abbreviated US$ and referred to as the dollar, U.S. dollar, or American dollar) is the official currency of the United States. $1 is subdivided into 100 smaller cent (¢) units, but officially it can be divided into 1000 mills (₥). '; 
      this.showCurrency('US Dollar', content);
    }
    if (currency == 'BTC') { 
      let content = 'Bitcoin is a worldwide cryptocurrency and digital payment system called the first decentralized digital currency, as the system works without a central repository or single administrator. For more info google(Digital Currency)'; 
      this.showCurrency('Bitcoin', content);
    }
    if (currency == 'ZMW') { 
      let content = 'The Kwacha (code: ZMW) is the currency of Zambia, abbreviated with the symbol K. It is subdivided into 100 Ngwee.'; 
      this.showCurrency('Kwacha', content);
    }
    if (currency == 'BWP') { 
      let content = 'The pula is the currency of Botswana, abbreviated with the symbol P. It has the (code: BWP) and is subdivided into 100 thebe. FUNNY FACT: Pula literally means "rain" in Setswana, because rain is very scarce in Botswana — home to much of the Kalahari Desert — and therefore valuable and a blessing.'; 
      this.showCurrency('Pula', content);
    }
    if (currency == 'MZN') { 
      let content = 'The metical (plural: meticais) is the currency of Mozambique, abbreviated with the symbol MZN or MT. It is nominally divided into 100 centavos.'; 
      this.showCurrency('Metical', content);
    }
  }

  showCurrency(currency, content){
    let alert = this.alertCtrl.create({
      title: 'What is '+currency,
      subTitle: content,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
  }

}
