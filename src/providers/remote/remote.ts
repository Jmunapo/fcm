import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class RemoteProvider {
  something: any;
  num: number;

  constructor(public http: Http) {
    this.something = [];
  }

  public retrieveCurrency(froto, num) {
    let url = 'https://free.currencyconverterapi.com/api/v4/convert?q='
    return this.http.get(url+froto)
      .map(res => res.json())
      .map(data => {
        this.something.push(data.results);
        if (num == this.something.length){
          let newSomething =  this.something;
          this.something = [];
          return newSomething;
        }
      })
  }

  public authentication(ipaddress, password) {
    let body = new FormData();
    body.append('pwd', 'masterpassword');
    body.append('password', password);
    let url = 'http://' + ipaddress + '/auth.php';
    return this.http.post(url, body)
      .map(result => {
        return result;
      });
  }

}
