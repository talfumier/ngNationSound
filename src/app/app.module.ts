import { NgModule,LOCALE_ID,ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { registerLocaleData } from '@angular/common';
// import localeFr from '@angular/common/locales/fr';

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
import { AccordionComponent } from './home/accordion/accordion.component';
import { ArtistComponent } from './artist/artist.component';
import { ProgramComponent } from './program/program.component';
import { InputComponent } from './utilities/input/input.component';
import { SelectComponent } from './utilities/select/select.component';
import { EventComponent } from './program/event/event.component';
import { MapComponent } from './map/map.component';

// registerLocaleData(localeFr); //register fr-FR locale, default is en-US

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent,
    AccordionComponent,
    ArtistComponent,
    ProgramComponent,
    InputComponent,
    SelectComponent,
    EventComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({timeOut:3000}),    
    FormsModule
  ],
  providers: [    
    { provide: ErrorHandler,useClass: GenericErrorHandler },
    { provide: LOCALE_ID, useValue: 'fr-FR'},  //reset default locale to fr-FR
    { provide: Window, useValue: window },    
    { provide: Document, useValue: document }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
