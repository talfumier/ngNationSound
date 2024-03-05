import { NgModule,ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SlickCarouselModule } from 'ngx-slick-carousel';

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
import { ArtistComponent } from './artist/artist.component';
import { ProgramComponent } from './program/program.component';
import { InputComponent } from './utilities/input/input.component';
import { SelectComponent } from './utilities/select/select.component';
import { EventComponent } from './program/event/event.component';
import { MapComponent } from './map/map.component';
import { FaqComponent } from './faq/faq.component';
import { TicketingComponent } from './ticketing/ticketing.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NotFoundComponent,
    ArtistComponent,
    ProgramComponent,
    InputComponent,
    SelectComponent,
    EventComponent,
    MapComponent,
    FaqComponent,
    TicketingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({timeOut:3000}),    
    FormsModule,
    SlickCarouselModule
  ],
  providers: [    
    { provide: ErrorHandler,useClass: GenericErrorHandler },
    { provide: Window, useValue: window },    
    { provide: Document, useValue: document }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
