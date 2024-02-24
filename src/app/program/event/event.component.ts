import { Component,Input, OnInit } from '@angular/core';
import { format} from 'date-fns'
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
    // this._event.dates.map((date) => {
    //   console.log(this.getFormattedDate(date.date));
    // })

  }

  get event():ArtistEvents{
    return this._event;
  }  
  getFormattedDate(date:Date){
    return format(date,"dd MMMM HH:mm")

  }
  cleanup(type:string,location:string){
    if(type.includes("rencontre")) return "rencontre";
    return removeAccents(location);
  }
}
