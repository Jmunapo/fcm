import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdsPage } from './ads';

@NgModule({
    declarations: [
        AdsPage
    ],
    imports: [
        IonicPageModule.forChild(AdsPage),
    ],
})
export class AdsModule { }