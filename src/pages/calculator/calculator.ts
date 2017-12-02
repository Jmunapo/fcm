import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController  } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database'

@IonicPage()
@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html',
})
export class CalculatorPage {

  HistoryArray: Array<string> = [];
  working: any;
  result: any;
  history: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public modal: ModalController,
    public database: DatabaseProvider) {
  }

  ionViewWillLoad(){
    //this.database.removeData('calcHistory').then(val => {console.log(val)});
    this.working = '';
    this.result = '';
    this.history = '';
    this.database.getData('calcHistory').then(val => {
      if(val){
      this.HistoryArray = val;
        try {
          let histLen = this.HistoryArray.length;
          this.history = eval(this.HistoryArray[histLen-1]);
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
  //History
  presentModal(){
    const history = this.modal.create('ModalsPage', { title: 'History', data: this.HistoryArray});
    history.present();
    history.onDidDismiss(data => {
      if(data == 'del'){
        this.database.removeData('calcHistory').then(val => {
          this.HistoryArray = [];
        });
      }else if(data != 'del' && data !=  ''){
        this.history = data;
      }
    })
  }

  recallHist(hist){
    this.working = hist;
  }
  //all Functions Here

  calcNum(btn, calc = true) {
    
    if (btn == 'C') {
      this.working = '';
      this.result = '';
    }else if (btn == '=') {
      if (this.checkLastEntry(this.working)) {
        console.log('Please enter valid operation');
      } else {
        let actualRes = eval(this.working);
        if (actualRes == Infinity) {
          this.working = 'Infinity';
        } else if (String(actualRes).length > 9) {
          let opres = String(actualRes).slice(0, 8);
          this.working = eval(opres);
          this.result = '';
          this.history = this.working;
          
        } else {
          let histLen = this.HistoryArray.length;
          if (this.working && this.working != "" && this.working != this.HistoryArray[histLen - 1]){
            let re = /[-*+\/]/
            try {
              let found = this.working.match(re);
              if (found) {
                this.HistoryArray.push(this.working);
                this.database.setData('calcHistory', this.HistoryArray)
                  .then(val => {
                    if (val) {
                      console.log('data Saved');
                    }
                  });
              }
            } catch (error) {
              console.log(error);
            }
          }
          this.working = actualRes;
          this.history = actualRes
          this.result = '';
        }
      }
    } else {
      if (btn == '-' || btn == '+') {
        if (this.checkLastEntry(this.working)) {
          let opres = String(this.working).slice(0, -1);
          this.working = opres + btn;
        } else {
          this.working += btn;
        }
      } else if (btn == '*' || btn == '/') {
        if (this.working.length == 0) {
          this.working = '';
        } else {
          if (this.checkLastEntry(this.working)) {
            let opres = String(this.working).slice(0, -1);
            this.working = opres + btn;
          } else {
            this.working += btn;
          }
        }
      } else {
        if (String(this.working).charAt(0) == '0' || String(this.working).charAt(0) == 'I' || String(this.working).charAt(0) == 'u') {
          this.working = btn;
        } else {
          this.working += btn;
        }
      }
    }
    this.insertTemp(calc);
  }

  extraOpreand(btn) {
    if (btn == '%') {

    } else if (btn == 'C') {
      if (this.working.length > 1) {
        let res = String(this.working).slice(0, -1);
        this.working = res;
      } else {
        this.working = '';
      }
    } else if (btn == '0') {
      if (this.working.length != 0) {
        if (this.checkLastEntry(this.working)) {
          //returns true if last entry is [*/+-]
          if (this.working.length > 1) {
            this.working += btn;
          }
          console.log(!this.checkLastEntry(this.working));
        } else {
          this.working += btn;
        }
      }
    } else if (btn == '+/-') { /*Nothing yet */ }
  }

  insertTemp(culc){
    if(culc){
      let str = this.working;
      let re = /[-*+\/]/
      let found = str.match(re);
      if(found){
        let inputLen = found.input.length; //input length
        let res = found.input.charAt(inputLen - 1); //last entry
        if(!res.match(re)){
          try {
            let actualRes = eval(this.working);
            if (actualRes == Infinity) {
              this.result = 'Infinity';
            } else if (String(actualRes).length > 9) {
              let opres = String(actualRes).slice(0, 8);
              this.result = eval(opres);
            } else {
              this.result = actualRes;
            }
          } catch (e) {
            if (e instanceof SyntaxError) {
              console.log(e.message);
              let res = String(this.working).slice(0, -1);
              this.working = res;
            }
          }
        }
      }
    }
  }
  

  checkLastEntry(value, op = null) {
    let eqls = String(value);
    let len = eqls.length;
    let res = eqls.charAt(len - 1);
    if (res == '*' || res == '+' || res == '-' || res == '/') {
      if (op == null) {
        return true;
      } else {
        if (op == '/' || op == '*') {
          return false;
        }
      }
    } else {
      return false;
    }
  }
}
