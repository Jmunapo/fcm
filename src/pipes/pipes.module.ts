import { NgModule } from '@angular/core';
import { CapitalisePipe } from './capitalise/capitalise';
@NgModule({
	declarations: [CapitalisePipe],
	imports: [],
	exports: [CapitalisePipe]
})
export class PipesModule {}
