import { NgModule,LOCALE_ID,ErrorHandler } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { GenericErrorHandler } from './error/errorHandler';

registerLocaleData(localeFr); //register fr-FR locale, default is en-US

const routes:Routes=[
  {path:'',component:HomeComponent},  
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),  
    BrowserAnimationsModule,
    ToastrModule.forRoot({timeOut:3000}),    
  ],
  providers: [    
    { provide: ErrorHandler, useClass: GenericErrorHandler },
    { provide: LOCALE_ID, useValue: 'fr-FR'},  //reset default locale to fr-FR
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
