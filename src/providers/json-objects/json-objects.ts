import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class JsonObjectsProvider {
 
  public banking: {
    at_date: number,
    accounts: Array<any>
  }={
      at_date: 1512119464780,
      accounts: []
  }
  public accounts: {
    name: string,
    total: number,
    transactions: Array<any>
  } = {
    name: '',
    total: null,
    transactions: []
  };

  public transactions: {
    id: number,
    date: string,
    to: string,
    amount: number
  } = {
      id: 0,
      date: '',
      to: '',
      amount: null
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
    
    public product: {
      id: number,
      quantity: number,
      product_name: string,
      purchase_code: string,
      buying_price: number,
      selling_price: number,
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
      amount: number,
      spent_on: string,
      description: string,
      transaction_id: number,
    } = {
        id: 0,
        date: '',
        amount: null,
        spent_on: '',
        description: '',
        transaction_id: null
      }

      public expense_category: Array<string> = [
      'Meals and Entertainment',
      'Advertising and Marketing',
      'Bad Debt',
      'Family Expenses',
      'Other',
      'Rent',
      'Repairs and Maintanance',
      'Tax Payable',
      'Telephone Expenses',
      'Travel Expense',
      ]

  constructor() {
  }
}
