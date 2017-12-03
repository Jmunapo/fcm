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
      amount: null,
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
      place: string,
      purchase_code: string,
      amount_in_base: number,
      buying_currency: string;
      base_currency: string;
      confirm_purchase: number,
      rate: number
    } = {
        id: 0,
        date: '',
        place: '',
        purchase_code: '',
        amount_in_base: null,
        buying_currency: '',
        base_currency: 'USD',
        confirm_purchase: 0,
        rate: 1
    };
//conversion store cornversion data if base currency is not equal to USB
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
        buying_price: null,
        selling_price: null,
        quantity: null,
        description: ''
      }

    public expense: {
      id: number,
      date: string,
      from_account: string,
      category: string,
      description: string,
      amount: number
    } = {
        id: 0,
        date: '',
        from_account: '',
        category: '',
        description: '',
        amount: null
      }

  constructor(private database: DatabaseProvider) {
  }

  //Functions
 /*async setAccounts(name){
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
      return copy;
    }
//If the object cloned it restore to the default values
  revert(obj, obj_name){
    if (null == obj || "object" != typeof obj) return obj;
      var copy = {};
      for (var attr in obj) {
        if (obj_name == 'accounts') {
          //if (obj.hasOwnProperty(attr)) copy[attr] = this.accounts_instance[attr];
        }
      }
      console.log(copy);
      return copy;
    }*/
}
