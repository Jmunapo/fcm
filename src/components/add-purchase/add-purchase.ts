import { Component, Input } from '@angular/core';
import { RemoteProvider } from '../../providers/remote/remote';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { UtilsProvider } from '../../providers/utils/utils';

@Component({
  selector: 'add-purchase',
  templateUrl: 'add-purchase.html'
})
export class AddPurchaseComponent {
  @Input('purchase') purchase;


  purchase_instorage: Array<any> = [];
  amount_in_base: any = null;
  amnt: boolean;
  buying_currency: string = 'USD';
  date: any = null;
  dat: boolean;
  place: string = '';
  plc: boolean;

  constructor(private remote: RemoteProvider,
              private database: DatabaseProvider,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController,
              private utils: UtilsProvider) { }

    
  ngAfterViewInit() {
    this.database.getData('purchases')
    console.log(this.purchase);
    this.database.getData('purchases').then(v => {
      if (v) {
        this.purchase_instorage = v;
        console.log(v)
      }
    });
  }


  savePurchase(){
    if (this.validate()){
      let purch_code = this.createCode();
      if(purch_code){
        this.purchase.purchase_code = purch_code;
        this.prepareAndSave()
      }
    }
  }

  prepareAndSave(){
    this.purchase.amount_in_base = Number(this.amount_in_base);
    this.purchase.id =(this.purchase_instorage.length + 1)
    this.purchase.buying_currency = this.buying_currency;
    this.purchase.place = this.place;
    if (this.buying_currency !== 'USD'){
      this.convertAndSave();
    } else if (this.buying_currency === 'USD') {
      this.purchase_instorage.push(this.purchase);
      this.database.setData('purchases', this.purchase_instorage).then(f => {
        if (f) {
          this.utils.simpleToster('Purchase saved', 'top')
          this.navCtrl.pop();
        }
      });
    }
  }

  convertAndSave(){
    let loader = this.loadingCtrl.create({
      content: 'Saving',
      duration: 5000,
      spinner: 'bubbles',
    });
    let fromto = 'USD_'+this.buying_currency;
    loader.present();
    this.remote.retrieveOne(fromto).subscribe(v =>{
      if(v){
        let rate = v.val;
        this.purchase.rate = rate;
        this.purchase_instorage.push(this.purchase);
        this.database.setData('purchases', this.purchase_instorage).then(f=>{
          if (f) {
            loader.dismiss();
            this.utils.simpleToster('Purchase saved', 'top')
            this.navCtrl.pop();
          }
        });
      }
    }, err =>{
      console.log(err)
      this.utils.simpleToster('You are not connected to the internet! Save in USD', 'middle')
      loader.dismiss();
    })
  }



  validate(){
    let c = 0;
    if (!this.amount_in_base || this.amount_in_base === '') {
      this.amnt = true;
    } else if (this.amount_in_base && this.amount_in_base !== '') { c++; }

    if (!this.date) {
      this.dat = true;
    } else if (this.date) { 
      let d = new Date(this.date)
      this.purchase.date =  d.getTime();
      c++; }

    if (!this.place || this.place === '') {
      this.plc = true;
    } else if (this.place && this.place !== '') { c++; }
    if(c === 3){
      return true;
    }
    return false;

  }
  d(){
    this.dat = false;
  }
  a(){
    this.amnt = false;
  }
  p() {
    this.plc = false;
  }

  createCode() {
    let d = new Date(this.date)
    let code_date = d.toDateString().replace(/ /g, '-').toUpperCase();
    let wordArray = [];
    wordArray = this.place.split(" ");
    if (wordArray.length === 1){
      let word = wordArray[0];
      if(word.length < 4){
        let _word = word.toUpperCase();
        let _code = _word + '-' +code_date;
        return _code;
      }else{
        let _word = word.slice(0, 3).toUpperCase();
        let _code = _word +'-'+ code_date;
        return _code;
      }
    } else if (wordArray.length > 1){
        let word = '';
        let c = 0;
        for(let i = 0; i< wordArray.length; i++){
          let _word = wordArray[i].charAt(0);
          word = word+_word;
          c++
          if (c == wordArray.length){
            let _code = (word + '-' + code_date).toUpperCase()
            return _code;
          }
        }
      }
    return false;
  }
}
