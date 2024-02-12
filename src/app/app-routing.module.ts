import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArtistComponent } from './artist/artist.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProgramComponent } from './program/program.component';

const routes:Routes=[  
  {path:'',component:HomeComponent},   
  {path:'program',component:ProgramComponent},
  {path:'artist/:id/:from',component:ArtistComponent},
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
