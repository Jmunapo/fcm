import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrencyPage } from './currency';

@NgModule({
  declarations: [
    CurrencyPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrencyPage),
  ],
})
export class CurrencyPageModule {}
