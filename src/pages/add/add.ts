import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { DatabaseProvider } from '../../providers/database/database';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { JsonObjectsProvider } from '../../providers/json-objects/json-objects';

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {
  //Sale object
  sale: { customer: string, item_array: Array<any>, saleDate: string, notes: string, payment_method: string } = {
    customer: '',
    item_array: [],
    saleDate: '',
    notes: '',
    payment_method: ''
  };
  //Item oject to push into item_array[]

  item_obj: { item_name: string, discount: number, quantity: number} = {
    item_name: '',
    discount: 0,
    quantity: 1
  }

  instorage: any; //get products in storage
  salesInstorage: Array<any> = []; //get sales from storage
  accounts: Array<any> = []; //store selected accounts
  addSell: boolean; //to display add sell ion-content
  addExpense: boolean; //to display add expense in ion-content
  addProduct: boolean; //'''''''''''''''''''''''''''''''''''''''
  addNote: boolean; // to display add notes in ion-content
  itemfocusVar: boolean; //Hide auto generate note on focus on add sell
  addPurchase: boolean; //''''''''''''''''''''''''''''''''''''''''''''
  addItem: any;
  title: string;
  color: string;
  temp_arry: {} = {};
  viewName: string = 'AddProduct';


  constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              public modal: ModalController,
              public alertCtrl: AlertController,
              public datePicker: DatePicker,
              public database: DatabaseProvider,
              public toaster: ToastController,
              private json: JsonObjectsProvider) {
  }
  ionViewWillLoad() {
    //Default parameter elements needed
    this.title = this.navParams.get('title');
    this.color = this.navParams.get('color');
    let addthing = this.navParams.get('addthing')
    if (addthing == 'addSell') { this.addSell = true; }

    if (addthing == 'addProduct') {
      this.addProduct = true;
      this.temp_arry = JSON.parse(JSON.stringify(this.json.product));
      console.log(this.temp_arry);
    }

    if (addthing == 'addPurchase') {
      this.addPurchase = true;
      this.temp_arry = JSON.parse(JSON.stringify(this.json.purchase));
      console.log(this.temp_arry);
    }

    if (addthing == 'addExpense') { this.addExpense = true;
        this.temp_arry = JSON.parse(JSON.stringify(this.json.expense));
    }

    if (addthing == 'addNote') { this.addNote = true; }
    if (this.title == null) { this.title = 'Add Page'; }
    if (this.color == null) { this.color = 'primary'; }
  }

  ionViewDidLoad() {
    this.database.getData('products').then(value =>{
      this.instorage = value;
    });
    this.database.getData('banking').then(value => {
      if(value){
        let i = 0;
        value.accounts.forEach(element => {
          this.accounts.push(element.name);
          i++;
        });
        if(i === value.length){
          console.log(this.accounts);
        }
      }
    });
    this.database.getData('sales').then(value => {
      if (value) {
          console.log(value);
          this.salesInstorage = value;
      }
    });
  }

  async objectKeys(element) {
    return Object.keys(element).filter(function (key) {
      let elem = element[key];
      return elem;
    });
  }

  itemfocusfunc(){
    this.itemfocusVar = true;
  }

  removeItem(index){
    console.log(index);
    this.sale.item_array.splice(index,1);
    console.log(this.sale);
  }

  addItemfunc() {
    let data = JSON.parse(JSON.stringify(this.item_obj));
    const history = this.modal.create('ModalsPage', { title: 'Add Item', item_obj: data, fromstorage: this.instorage }, { enableBackdropDismiss: false });
    history.present();
    history.onDidDismiss(data => {
      if (data != '') {
        console.log(data.item_name);
        if(data.item_name != ''){
          console.log(data)
          this.sale.item_array.push(data);
          console.log(this.sale.item_array)
        }else{
          this.simpleToster('Select Item');
        }
      }
    });
  }

  saveData(title){
    if (title == 'Record Sell'){
      let customerNo = this.salesInstorage.length + 1;
      if (this.sale.customer == "") { this.sale.customer = 'Customer '+ customerNo; }
      if (this.sale.payment_method != "" && this.sale.saleDate != "") {
        if (this.sale.item_array.length > 0){
          this.salesInstorage.push(this.sale)
          console.log(this.salesInstorage);
          this.database.setData('sales', this.salesInstorage).then(val => {
            if (val) {
              this.simpleToster('Sell Saved');
              this.navCtrl.pop();
            } else {
              this.simpleToster('Sorry there was an error, Restartb your app');
            }
          });
        }else{
          this.simpleToster('Add Items');
          this.addItemfunc();
        }
      }else{
        this.simpleToster('Select Payment Method and Date');
      }
    }
    if (title !== 'Record Sell') { this.navCtrl.pop(); }
  }

  simpleToster(msg) {
    let toast = this.toaster.create({
      message: msg,
      position: 'top',
      duration: 3000
    });
    toast.present();
  }

}
