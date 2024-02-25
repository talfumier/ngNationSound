import { Component,Input, OnInit } from '@angular/core';
import { ArtistEvents } from '../../../services/interfaces';
import { removeAccents } from '../../utilities/functions/utlityFunctions';

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
  cleanup(type:string,location:string){
    if(type.includes("rencontre")) return "rencontre";
    return removeAccents(location);
  }
}
