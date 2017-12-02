import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePicker } from '@ionic-native/date-picker';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RemoteProvider } from '../providers/remote/remote';
import { DatabaseProvider } from '../providers/database/database';
import { UtilsProvider } from '../providers/utils/utils';
import { JsonObjectsProvider } from '../providers/json-objects/json-objects';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RemoteProvider,
    DatabaseProvider,
    UtilsProvider,
    JsonObjectsProvider
  ]
})
export class AppModule {}