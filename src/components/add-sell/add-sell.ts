import { Component, Input } from '@angular/core';
import { JsonObjectsProvider } from '../../providers/json-objects/json-objects';
import { DatabaseProvider } from '../../providers/database/database';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';


@Component({
  selector: 'add-sell',
  templateUrl: 'add-sell.html'
})
export class AddSellComponent {
  @Input('sell') sell;
  dat: boolean = false;
  amnt: boolean = false;
  //store sell object from json objects
  sell_obj: any = {};
  //store sell item array
  item_arry: Array<any> = [];
  //Item oject to push into item_array[]
  item_obj: { item_name: string, discount: number, quantity: number } = {
    item_name: '',
    discount: 0,
    quantity: 1
  }
  amount: number = 0;
  temp_amount: Array<any> = [];

  //to display accounts in dom without purchase account
  dom_accounts_array: Array<any> = [];
  //To hold banking Object
  banking_instorage: any = {};
  //To hold Acounts Array
  accounts_instorage: any;
  //To get selected item index
  dom_accounts_index: Array<any> = [];
  //Store transaction details to record on Done
  temp_transaction_array: Array<any> = [];
  transactions_instorage: Array<any> = [];
  //Get sale from storage to get cusomer number
  sales_instorage: Array<any> = []; //get sales from storage


  constructor(private json: JsonObjectsProvider,
              private database: DatabaseProvider,
              private alertCtrl: AlertController,
              private modal: ModalController) {  }
  ngAfterViewInit() {
    this.database.getData('banking').then(f => {
      if (f) {
        this.banking_instorage = f;
        this.accounts_instorage = f.accounts;
        let accounts = this.accounts_instorage;
        for (let i = 0; i < accounts.length; i++) {
          if (accounts[i].name !== 'purchase') {
            this.dom_accounts_array.push(accounts[i]);
          }
        }
      }
    });
    this.database.getData('transactions').then(t => {
      if (t) {
        this.transactions_instorage = t;
      }
    });

    this.database.getData('products').then(p => {
      if (p) {
        console.log(p);
      }
    });
  }
  //show the popup to get amount from the user
  payment_mode(index, name) {
    let check_dom = this.dom_accounts_index[index];
    console.log(this.dom_accounts_index)
    if (check_dom) {
      console.log('Adding To Accounts');
      this.get_credited_amount(index, name, '');
    } else if (!check_dom) {
      try {
        let recall = this.temp_amount[index].amount;
        this.amount -= recall;
        this.temp_amount[index] = undefined;
      } catch (error) {
      }
    }
  }

  get_credited_amount(index, name, err) {
    let prompt = this.alertCtrl.create({
      title: 'Mode: ' + name,
      message: err,
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'paid',
          type: 'number',
          placeholder: 'Paid ($)'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            this.dom_accounts_index[index] = false;
          }
        },
        {
          text: 'Paid',
          handler: data => {
            if (data.paid !== '') {
              let paid = Number(data.paid);
              this.temp_amount[index] = { name: name, amount: paid };
              this.amount += paid;
            }else{
              this.get_credited_amount(index, name, 'Enter Amount');
            }
          }
        }
      ]
    });
      prompt.present();
  }
  remove_item(index) {
    console.log(index);
    this.sell_obj.item_array.splice(index, 1);
    console.log(this.sell_obj);
  }

  add_item() {
    let data = JSON.parse(JSON.stringify(this.item_obj));
    const history = this.modal.create('ModalsPage', { title: 'Add Item', item_obj: data, fromstorage: this.sales_instorage }, { enableBackdropDismiss: false });
    history.present();
    history.onDidDismiss(data => {
      if (data != '') {
        console.log(data.item_name);
        if (data.item_name != '') {
          console.log(data)
          this.sell_obj.item_array.push(data);
          console.log(this.sell_obj.item_array)
        } else {
          //this.simpleToster('Select Item');
        }
      }
    });
  }
  remove_err(err) {
    if (err === 'dat') { this.dat = false; }
    if (err === 'amnt') { this.amnt = false; }
  }
}
