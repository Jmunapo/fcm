import { Injectable } from '@angular/core';
import { LoadingController  } from 'ionic-angular';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Events } from 'ionic-angular';

@Injectable()
export class UtilsProvider {
  constructor(
    private loadingCtrl: LoadingController,
    private alrtCtrl: AlertController,
    private toaster: ToastController,
    private events: Events
  ) {}

  public showLoader(content = 'Please wait...'){
    let loader = this.loadingCtrl.create({
      content: content,
      duration: 6000
    });
    loader.present();
  }

  public simpleAlrt(content) {
    let alert = this.alrtCtrl.create({
      subTitle: content,
      buttons: ['OK']
    });
    alert.present();
  }

  public simpleToster(msg, pos) {
    let toast = this.toaster.create({
      message: msg,
      position: pos,
      duration: 3000
    });
    toast.present();
  }
  public showConfAlrt(title, msg, agree, disagree, page){
    let confirm = this.alrtCtrl.create({
      title: title,
      message: msg,
      buttons: [
        {
          text: disagree,
          handler: () => {
            console.log(disagree)
          }
        },
        {
          text: agree,
          handler: () => {
            this.events.publish(page);
            console.log(page)
           console.log(agree)
          }
        }
      ]
    });
    confirm.present();
  }


  transform(value) {
    if (value) {
      const words = value.split(' ');

      value = words.map((word) => word.substring(0, 1).toUpperCase() + word.substring(1)).join(' ');
    }
    return value;
  }
}
