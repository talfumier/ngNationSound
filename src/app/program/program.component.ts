import { Component } from '@angular/core';
import _ from 'lodash';
import { DataService } from '../../services/data.service';
import { ArtistEvents } from '../../services/interfaces';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrl: './program.component.css'
})
export class ProgramComponent {
  private _events:ArtistEvents[]=[];

  constructor(private service:DataService){
    this._events=this.getFormattedData();
    console.log(this._events);
  }

  getFormattedData(){
    const AllArtistEvents:ArtistEvents[]=[];
    let artistEvts:ArtistEvents={} as ArtistEvents,i=null,date:any="",x="";
    this.service.events.map((evt) => {
      i=-1;
      artistEvts=_.filter(AllArtistEvents,(artistEvents,idx) => {
        if(artistEvents.performer.id===evt.performer.id){
          i=idx;
          return true;
        }
        else return false;
      })[0];
      if(!artistEvts) 
        artistEvts={
          performer:evt.performer,
          dates:[]
        };
      date=evt.date.split(" ")[0].split(".");
      x=date[0],date[0]=date[1],date[1]=x;
      date[3]=evt.date.split(" ")[1];
      artistEvts.dates.push({date:new Date(date.join()),location:evt.location,type:evt.type});
      if(i===-1) AllArtistEvents.push(artistEvts);
      else AllArtistEvents[i]=artistEvts;      
    });
    return AllArtistEvents;
  }

  get events():ArtistEvents[]{
    return this._events;
  }
}