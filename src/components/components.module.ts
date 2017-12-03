import { NgModule } from '@angular/core';
import { AddExpenseComponent } from './add-expense/add-expense';
import { AddProductComponent } from './add-product/add-product';
import { AddPurchaseComponent } from './add-purchase/add-purchase';

@NgModule({
	declarations: [AddExpenseComponent,
    AddProductComponent,
    AddPurchaseComponent],
	imports: [],
	exports: [AddExpenseComponent,
    AddProductComponent,
    AddPurchaseComponent]
})
export class ComponentsModule {}
