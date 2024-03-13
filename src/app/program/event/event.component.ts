import { Component,Input, OnInit } from '@angular/core';
import {format,parse} from 'date-fns';
import { ArtistEvents,Event } from '../../../services/interfaces';
import { removeAccents } from '../../utilities/functions/utlityFunctions';
import { environment } from '../../../config/environment';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit {  
  @Input() data:ArtistEvents={} as ArtistEvents;

  private _event:ArtistEvents={}as ArtistEvents;  

  ngOnInit(): void {
    this._event=this.data;
  }

  get event():ArtistEvents{
    return this._event;
  }  
  formattedDate(date:string) { //work-around to avoid 'invalid date' warning on ios devices
    const fmt=environment.apiMode==="local"?"dd.MM.yyyy HH:mm":"yyyy-MM-dd HH:mm:ss";//date parameter format
    return format(parse(date,fmt,new Date()),"dd MMMM '-' HH'h'mm");
  }
  cleanup(type:string,location:string){
    if(type.includes("rencontre")) return "rencontre";
    return removeAccents(location);
  }  
  getArtistPath(event:ArtistEvents){
    return environment.apiMode==="local"?('assets/images/artists/' + event.performer.filename):event.performer.image;
  }
}
