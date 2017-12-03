import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PurchasesPage } from './purchases';

@NgModule({
  declarations: [
    PurchasesPage,
  ],
  imports: [
    IonicPageModule.forChild(PurchasesPage),
  ],
})
export class PurchasesPageModule {}
