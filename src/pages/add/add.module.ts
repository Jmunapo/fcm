import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPage } from './add';
import { AddExpenseComponent } from '../../components/add-expense/add-expense';
import { AddProductComponent } from '../../components/add-product/add-product';
import { AddPurchaseComponent } from '../../components/add-purchase/add-purchase';

@NgModule({
  declarations: [
    AddPage,
    AddProductComponent,
    AddExpenseComponent,
    AddPurchaseComponent,
  ],
  imports: [
    IonicPageModule.forChild(AddPage),
  ],
})
export class AddPageModule {}
