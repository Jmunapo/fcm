import { NgModule } from '@angular/core';
import { AddExpenseComponent } from './add-expense/add-expense';
import { AddProductComponent } from './add-product/add-product';
import { AddPurchaseComponent } from './add-purchase/add-purchase';
import { AddSellComponent } from './add-sell/add-sell';

@NgModule({
	declarations: [AddExpenseComponent,
    AddProductComponent,
    AddPurchaseComponent,
    AddSellComponent],
	imports: [],
	exports: [AddExpenseComponent,
    AddProductComponent,
    AddPurchaseComponent,
    AddSellComponent]
})
export class ComponentsModule {}
