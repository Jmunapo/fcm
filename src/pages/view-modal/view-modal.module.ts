import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewModalPage } from './view-modal';

@NgModule({
  declarations: [
    ViewModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewModalPage),
  ],
})
export class ViewModalPageModule {}
