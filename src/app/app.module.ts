import { NgModule,APP_INITIALIZER,ErrorHandler} from '@angular/core';
import {forkJoin, tap} from 'rxjs'; 
import { FormsModule } from '@angular/forms';

import { SlickCarouselModule } from 'ngx-slick-carousel';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { GenericErrorHandler } from '../error/errorHandler';
import { ArtistComponent } from './artist/artist.component';
import { ProgramComponent } from './program/program.component';
import { InputComponent } from './utilities/input/input.component';
import { SelectComponent } from './utilities/select/select.component';
import { EventComponent } from './program/event/event.component';
import { MapComponent } from './map/map.component';
import { FaqComponent } from './faq/faq.component';
import { TicketingComponent } from './ticketing/ticketing.component';
import { ApiService } from '../services/data/init/api.service';
import { environment } from '../config/environment';
import { LoadingService } from '../services/loading.service';

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
    SlickCarouselModule,
    HttpClientModule
  ],
  providers: [    
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp, 
      multi: true, 
      deps:[ApiService,LoadingService]
    },
    { provide: ErrorHandler,useClass: GenericErrorHandler },
    { provide: Window, useValue: window },    
    { provide: Document, useValue: document }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}

function initializeApp(apiService:ApiService,loadingService:LoadingService){ //api data loading done before page starts loading
  if(environment.apiMode!=="local"){
    // loadingService.setLoadingStatus(true);    
    const cols=["dates","artists","messages","transports","faqs","partners","pois","events","umap_pois"]; //umap_pois returns only the url to the map data that are then loaded in the home page
    return () => forkJoin(cols.map((col:string) => {
      return apiService.getApiObs(col);
    })).pipe(
      tap((data) => {
          data.map((item,idx) => {
            apiService.formatApiData(cols[idx],item);            
            if(idx===cols.length-1)loadingService.setLoadingStatus(false);
          });
      })
    );
  }
  else return () => {}; //function that does nothing (function to be returned anyway)
}


