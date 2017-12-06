import { Component, Input } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { UtilsProvider } from '../../providers/utils/utils';
import { JsonObjectsProvider } from '../../providers/json-objects/json-objects';
import { RemoteProvider } from '../../providers/remote/remote';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@Component({
  selector: 'add-product',
  templateUrl: 'add-product.html'
})
export class AddProductComponent {
  @Input('product') product;
  //holding Purchases data in storage
  purchase_arr: Array<any> = [];

  purchase_id: any;
  purchase_currency: any;
  purchase_obj: any;

  //View Models
  buying_price: number = null;
  description: string = '';
  product_name: string = '';
  purchase_code: string = '';
  quantity: number = null;
  selling_price: number = null;

  bprice: boolean = false;
  sprice: boolean = false;
  quant: boolean = false;
  pname: boolean = false;
  pcode: boolean = false;

  temp_arry: Array<any> = [];
  products_instorage: any = [];

  amount: number = null;
  id: number = null;


  constructor(private database: DatabaseProvider,
              private utils: UtilsProvider,
              private json: JsonObjectsProvider,
              private remote: RemoteProvider,
              private navCtrl: NavController) { }

  ngAfterViewInit() {
    this.database.getData('purchases').then(v => {
      if (v) {
        this.purchase_arr = v;
        console.log(v)
      }
    });
    this.database.getData('products').then(value => {
      if (value) {
        this.products_instorage = value;
      }
    });
  }

  saveProduct() {
    if (this.validate()){
      let sell = Number(this.selling_price);
      let buy = this.currencyConverter(this.buying_price);
      console.log(buy);
      let product_total_pric = buy*(Number(this.quantity));
      if(buy < sell){
        if (this.confirmPurchase(product_total_pric)){
          this.saveDataToDatabase();
        }else{
          this.utils.simpleToster('Invalid Buying Price, Edit Purchase details if ' + this.switchCurr(this.purchase_currency)+buy+' is correct buying price', 'middle');
        }
      }else{
        this.utils.simpleToster('Enter Valid Buying And Selling Pices', 'middle');
      }
    }
  }


  undo(what){
    if (what === 'pname') { this.pname = false; }
    if (what === 'bprice') { this.bprice = false; }
    if (what === 'quant') { this.quant = false; }
    if (what === 'sprice') { this.sprice = false; }
  }
  validate(){
    let c = 0;
    if (this.buying_price === null || this.buying_price == 0) { this.bprice = true; } else { this.bprice = false; c++; }
    if (this.product_name === "") { this.pname = true; } else { this.pname = false; c++;}
    if (this.quantity == null || this.quantity == 0) { this.quant = true; } else { this.quant = false; c++;}
    if (this.selling_price == null || this.selling_price == 0) { this.sprice = true; } else { this.sprice = false; c++; }
    if (this.purchase_code === "") { this.pcode = true; } else { this.pcode = false; c++; }
    if(c === 5){
      return true;
    }else {
      return false;
    }
  }
  p(){
    console.log(this.purchase_id)
    if (this.purchase_id == '-1'){
      this.reloadStorage();
        this.utils.showLoader('Wait...')
        this.navCtrl.push('AddPage', {
          title: 'Add Purchase',
          color: 'primary',
          addthing: 'addPurchase'
        });
      return false;
    }
    this.pcode = false;
    let element = this.purchase_arr;
    let id = Number(this.purchase_id);
    for (let i = 0; i < element.length; i++){
      if(element[i].id === id){
        this.purchase_currency = element[i].buying_currency;
        this.purchase_code = element[i].purchase_code;
        this.purchase_obj = element;
      }
    }
  }

  saveDataToDatabase(){
    this.utils.showLoader('Saving...');
    this.product.buying_price = Number(this.buying_price);
    this.product.description = this.description;
    this.product.product_name = this.product_name;
    this.product.purchase_code = this.purchase_code;
    this.product.quantity = Number(this.quantity);
    this.product.selling_price = Number(this.selling_price);
    let prolength = this.products_instorage.length;
    this.product.id = prolength + 1;
    this.products_instorage.push(this.product);
    this.database.setData('products', this.products_instorage).then(v=>{
      if(v){
        console.log('Product Data Entered');
        this.database.setData('purchases', this.purchase_arr).then(val => {
          if (val) {
            this.utils.simpleToster('Product Added', 'top');
            this.product = JSON.parse(JSON.stringify(this.json.product));
            this.reloadStorage();
          }
        });
      }
    });
  }  

 

  //Checking Numbers
  confirmPurchase(total: number){
    let element = this.purchase_arr;
    let id = Number(this.purchase_id);
    for (let i = 0; i < element.length; i++) {
      if (element[i].id === id) {
        let _total = this.currencyConverter(element[i].amount_in_base);
        let confirmed = element[i].confirm_purchase;
        let con_total = confirmed+total;
        let con_diff = _total - con_total;
        if(total > _total){
          return false;
        }
        if (con_total > _total){
          return false;
        }
        if (con_diff < 0){
          return false;
        }
        if(_total >= total+confirmed){
          element[i].confirm_purchase = this.convertBack(confirmed+total);
          return true;
        }
      }
    }
  }

  convertBack(amount){
    for (let i = 0; i < this.purchase_arr.length; i++) {
      if (this.purchase_arr[i].id === Number(this.purchase_id)) {
        let element = this.purchase_arr[i];
        let total = Number(amount * element.rate);
        return total;
      }
    }
  }
  currencyConverter(amount){
    if (this.purchase_currency == 'USD'){
      return amount;
      }else{
        for(let i = 0; i < this.purchase_arr.length; i++){
          if (this.purchase_arr[i].id === Number(this.purchase_id)){
            let element = this.purchase_arr[i];
            let total = Number(amount/element.rate);
            return total;
          }
        }
      }
    }

    reloadStorage() {
      this.buying_price = null;
      this.description = '';
      this.product_name = '';
      this.purchase_code = '';
      this.purchase_id = null;
      this.purchase_currency = null;
      this.quantity = null;
      this.selling_price = null;
      this.database.getData('purchases').then(v => {
        if (v) {
          this.purchase_arr = v;
          console.log(v)
        }
      });
      this.database.getData('products').then(value => {
        if (value) {
          this.products_instorage = value;
          console.log(value);
          console.log(this.purchase_arr);
        }
      });
    }
  
































  /*

  addProduct() {
    if (this.product.buying_price == null) { this.bprice = true; } else { this.bprice = false; }
    if (this.product.product_name == "") { this.pname = true; } else { this.pname = false; }
    if (this.product.quantity == null || this.product.quantity == 0) { this.quant = true; } else { this.quant = false; }
    if (this.product.selling_price == null) { this.sprice = true; } else { this.sprice = false; }

    if (!this.sprice && !this.bprice && !this.quant && !this.pname) {
      if (Number(this.product.selling_price) <= Number(this.product.buying_price)) {
        this.utils.simpleToster('Please enter Valid prices','top')
      } else {
        this.validateAndStore();
      }
    }
  }

  validateAndStore() {
    let loop_num = 0;
    let new_producy_name = this.product.product_name;
    let array_size = this.productArray.length;
    if (this.productArray.length >= 1) {
      this.productArray.forEach(element => {
        if (element.product_name == new_producy_name) {
          this.utils.simpleToster('Product Already Exists, Use Edit in (Stock)','top');
        } else {
          loop_num++;
        }
        if (loop_num == array_size) {
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
    } else {
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
  }*/
  switchCurr(curr){
    if(curr == 'USD'){
      return '$';
    }else{
      return curr;
    }
  }

}
