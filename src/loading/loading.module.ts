import { NgModule,ErrorHandler} from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { GenericErrorHandler } from '../error/errorHandler';
import { LoadingComponent } from './loading.component';

@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({timeOut:3000}),   
  ],
  providers: [   
    { provide: ErrorHandler,useClass: GenericErrorHandler },
    { provide: Window, useValue: window },    
    { provide: Document, useValue: document }
  ],
  bootstrap: [LoadingComponent]
})
export class Loadingodule { 
}