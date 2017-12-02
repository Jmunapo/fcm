import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankingPage } from './banking';

@NgModule({
  declarations: [
    BankingPage,
  ],
  imports: [
    IonicPageModule.forChild(BankingPage),
  ],
})
export class BankingPageModule {}
