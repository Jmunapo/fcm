import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StockPage } from './stock';

@NgModule({
  declarations: [
    StockPage,
  ],
  imports: [
    IonicPageModule.forChild(StockPage),
  ],
})
export class StockPageModule {}
