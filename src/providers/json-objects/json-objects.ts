import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class JsonObjectsProvider {

  public accounts: {
    at_date: number,
    name: string,
    total: number,
    transactions: Array<any>
  } = {
    at_date: 1512119464780,
    name: '',
    total: 6,
    transactions: []
  };

  public temp_array: Array<any> = [];
  public transactions: {
    id: number,
    date: string,
    amount: number,
    to: string,
    from: string
  } = {
      id: 0,
      date: '',
      amount: 0,
      to: '',
      from: ''
  };

  public sales: {
    id: number,
    date: string,
    customer: string,
    payment_method: string,
    total: number,
    item_array: Array<any>
  }= {
      id: 0,
      date: '',
      customer: '',
      payment_method: '',
      total: 0,
      item_array: []
  };

  public item_array: {
    item_name: string,
    discount: number,
    quantity: number
  } = {
      item_name: '',
      discount: 0,
      quantity: 0
    }

    public purchase: {
      id: number,
      date: string,
      purchase_code: string,
      amount_in_base: number,
      accounts: Array<string>,
      currency: string;
      base_currency: string;
    } = {
        id: 0,
        date: '',
        purchase_code: '',
        amount_in_base: 0,
        accounts: [],
        currency: '',
        base_currency: ''
    };

    public product: {
      id: number,
      product_name: string,
      purchase_code: string,
      buying_price: number,
      selling_price: number,
      quantity: number,
      description: string
    } = {
        id: 0,
        product_name: '',
        purchase_code: '',
        buying_price: 0,
        selling_price: 0,
        quantity: 0,
        description: ''
      }

    public expense: {
      id: number,
      date: string,
      from_account: string,
      expense_category: string,
      description: string,
      amount: number
    } = {
        id: 0,
        date: '',
        from_account: '',
        expense_category: '',
        description: '',
        amount: 0
      }
  
  product_instance: any;
  accounts_instance: any;
  sales_instance: any;
  expense_instance: any;
  purchase_instance: any;
  item_array_instance: any;
  transactions_instance: any;

  constructor(private database: DatabaseProvider) {
    this.product_instance = this.clone(this.product);
    this.accounts_instance = this.clone(this.accounts);
    this.sales_instance =  this.clone(this.sales);
    this.expense_instance =  this.clone(this.expense);
    this.purchase_instance = this.clone( this.purchase);
    this.item_array_instance =  this.clone(this.item_array);
    this.transactions_instance =  this.clone(this.transactions);
    console.log('Work Zone');
  }

  //Functions
 async setAccounts(name){
  await  this.database.getData('banking').then(val =>{
      if(val){
        let checking = this.checkArr(val, name);
        if(checking){
          return 'Account Already In Storage';
        }else {
          console.log(checking);
          console.log(val);
          return 'something';
        }
      }else{
        this.temp_array.push(this.accounts);
        this.database.setData('banking', this.temp_array).then(v=>{
          if(v){ 
            console.log('Data Entered');
            this.temp_array = [];
          }
        })
      }
    })


  }

  checkArr(arr, name){
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].name === name) {
        return true;
      }
    }
    return false;
  }







































//Objects Functions Clone and Restore to the original, Check if the element exist in and Array[];

//returns true if there is no element
  check(Arr: Array<any>, name){
    let arrCount = 0;
    let arrLen = Arr.length;
   Arr.forEach(elem => {
      this.objectKeys(elem).then(val =>{
        if(val){
          let objCount = 0;
          val.forEach(i => {
           console.log('Run');
            if(elem[i] !== name){
              objCount++;
            }
            if (val.length === objCount){
              console.log('Run322');
              arrCount++
              if(arrCount === arrLen){
                return true;
              }
            }
          });
        }
      });
    });
  }
//Returns []Array of keys
  async objectKeys(element) {
    return Object.keys(element).filter(function (key) {
      let elem = element[key];
      return elem;
    });
  }
  //Clone the object
  clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
      var copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      console.log(copy);
      return copy;
    }
//If the object cloned it restore to the default values
  revert(obj, obj_name){
    if (null == obj || "object" != typeof obj) return obj;
      var copy = {};
      for (var attr in obj) {
        if (obj_name == 'accounts') {
          if (obj.hasOwnProperty(attr)) copy[attr] = this.accounts_instance[attr];
        }
      }
      console.log(copy);
      return copy;
    }
}
