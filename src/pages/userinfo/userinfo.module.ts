import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserinfoPage } from './userinfo';

@NgModule({
  declarations: [
    UserinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(UserinfoPage),
  ],
})
export class UserinfoPageModule {}
