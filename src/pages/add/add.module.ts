import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPage } from './add';
import { AddExpenseComponent } from '../../components/add-expense/add-expense';

@NgModule({
  declarations: [
    AddPage,
    AddExpenseComponent
  ],
  imports: [
    IonicPageModule.forChild(AddPage),
  ],
})
export class AddPageModule {}
