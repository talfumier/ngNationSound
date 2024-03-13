import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArtistComponent } from './artist/artist.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProgramComponent } from './program/program.component';
import { MapComponent } from './map/map.component';
import { eventsResolver } from '../services/filter.service';
import { TicketingComponent } from './ticketing/ticketing.component';

const routes:Routes=[  
  {path:'',component:HomeComponent},//,resolve:{data:dataResolver}},
  {path:'program',component:ProgramComponent,resolve:{events:eventsResolver}},
  {path:'map/:stage',component:MapComponent},
  {path:'artist/:id',component:ArtistComponent},
  {path:'ticketing',component:TicketingComponent},
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
