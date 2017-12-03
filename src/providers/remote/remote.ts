import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class RemoteProvider {
  count: any;
  num: number;

  constructor(public http: Http) {
    this.count = [];
  }

  public retrieveCurrency(froto, num) {
    let url = 'https://free.currencyconverterapi.com/api/v4/convert?q='
    return this.http.get(url+froto)
      .map(res => res.json())
      .map(data => {
        this.count.push(data.results);
        if (num == this.count.length){
          let result = this.count;
          this.count = [];
          return result;
        }
      })
  }
}
