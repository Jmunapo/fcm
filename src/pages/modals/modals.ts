import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modals',
  templateUrl: 'modals.html',
})
export class ModalsPage {
  title : string;
  HistoryArray: Array<string> = [];
  cash: number;
  ecocash: number;
  checked: number = 0;
  product: any;
  tempproduct: any;
  productArray: Array<any> = [];

  bprice: boolean = false;
  sprice: boolean = false;
  quant: boolean = false;
  pname: boolean = false;
  showDone: boolean= false;

  c: boolean;
  e: boolean;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public toaster: ToastController,
     private viewCtrl: ViewController) {
    this.title = 'Title'
  }

  ionViewWillLoad() {
   this.title =  this.navParams.get('title');
    if (this.navParams.get('data')) { this.HistoryArray = this.worked(this.navParams.get('data')); }
    if (this.navParams.get('info')) {
      this.pushAccounts(this.navParams.get('info'));
    }

    if (this.navParams.get('product')) {
      this.product = this.navParams.get('product');
      this.keep();
    }
    if (this.navParams.get('instorage')) {
      let instorage = this.navParams.get('instorage');
      this.productArray = instorage;
      console.log(this.productArray)
      this.showDone = true;
    }

    if (this.navParams.get('item_obj')) {
      let item_obj = this.navParams.get('item_obj');
      let fromstorage = this.navParams.get('fromstorage');
      this.productArray = item_obj;
      this.HistoryArray = fromstorage;
      console.log(this.HistoryArray)
    }
  }
  keep(){
    if(this.tempproduct == undefined){
      this.tempproduct = JSON.parse(JSON.stringify(this.product));
      console.log(this.tempproduct);
    }else {
      this.product = JSON.parse(JSON.stringify(this.tempproduct));
    }
    
  }

  pushAccounts(array){
    if (array.indexOf("c") != -1) { this.checked++; this.c = true; }
    if (array.indexOf("e") != -1) { this.checked++; this.e = true; }
  }
  closeModal(data){
    this.viewCtrl.dismiss(data);
  }

  addProduct(){
    if (this.product.buying_price == null) { this.bprice = true; } else { this.bprice = false; }
    if (this.product.product_name == "") { this.pname = true; } else { this.pname = false; }
    if (this.product.quantity == null || this.product.quantity == 0) { this.quant = true; } else { this.quant = false; } 
    if (this.product.selling_price == null) { this.sprice = true; } else { this.sprice = false; }
    
    if( !this.sprice && !this.bprice && !this.quant && !this.pname){
      if (Number(this.product.selling_price) <= Number(this.product.buying_price)) {
        this.simpleToster('Please enter Valid prices')
      }else{
        this.validateAndStore();
        }
    }
  }

  addItem(){
    this.viewCtrl.dismiss(this.productArray); 
  }


validateAndStore(){
  let loop_num = 0;
  let new_producy_name = this.product.product_name;
  let array_size = this.productArray.length;
    if(this.productArray.length >= 1){
    this.productArray.forEach(element => {
      if (element.product_name == new_producy_name){
        this.simpleToster('Product Already Exists, Use Edit in (Stock)');
        }else{
        loop_num++;
        }
          if(loop_num == array_size){
            //Doesn't Exist
            this.productArray.push(this.product);
            console.log(this.productArray);
            this.keep();
            let arrLen = this.productArray.length;
            let mssge = 'Product ' + arrLen + ' added';
            this.simpleToster(mssge);
            if (arrLen >= 3) {
              this.showDone = true;
            }
          }
      });
    }else{
      //New Product
      this.productArray.push(this.product);
      console.log(this.productArray);
      this.keep();
      let arrLen = this.productArray.length;
      let mssge = 'Product ' + arrLen + ' added';
      this.simpleToster(mssge);
      if (arrLen >= 3) {
        this.showDone = true;
      }
    }
  }

  done(){
    if (this.product.product_name == '') {
      
      this.viewCtrl.dismiss(this.productArray); 
      }else {
      this.simpleToster('Save your product first and Click done');
    }
    
  }

  simpleToster(msg){
    let toast = this.toaster.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

  saveAcc(){
    let userAcc: Array<any> = [];
    if (this.c && this.cash != undefined) { let val = { cash: this.cash }; userAcc.push(val); }
    if (this.e && this.ecocash != undefined) { let val = { ecocash: this.ecocash }; userAcc.push(val); }
    if(userAcc.length != this.checked){
      let toast = this.toaster.create({
        message: 'Please work out all your accounts and enter totals',
        position: 'top',
        duration: 4000
      });
      toast.present();
    }else if(userAcc.length == this.checked){
      this.viewCtrl.dismiss(userAcc);
    }
  }

  worked(data: Array<any>){
    let newData: Array<any> = [];
    data.forEach(element => {
      let val = eval(element);
      let newObj = [element, val]
      newData.push(newObj);
    });
    return newData.reverse();
  }

}
