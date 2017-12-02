import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalculatorPage } from './calculator';

@NgModule({
  declarations: [
    CalculatorPage,
  ],
  imports: [
    IonicPageModule.forChild(CalculatorPage),
  ],
})
export class CalculatorPageModule {}
