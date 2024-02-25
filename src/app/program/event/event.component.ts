import { Component,Input, OnInit } from '@angular/core';
import { ArtistEvents } from '../../../services/interfaces';
import { removeAccents } from '../../utilities/functions/utlityFunctions';
import {format} from 'date-fns';

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
  formattedDate(date:Date):string {
    return format(date,"dd MMMM ' - ' HH'h'mm");
    // console.log(parse(date.toDateString(),"dd MMMM yyyy",new Date()))
    // return parse(date.toDateString(),"dd MMMM yyyy",new Date());
  }
  cleanup(type:string,location:string){
    if(type.includes("rencontre")) return "rencontre";
    return removeAccents(location);
  }
}
