import { Component, HostListener} from '@angular/core';
import { NgForm } from '@angular/forms';
import _ from 'lodash';
import { DataService } from '../../services/data.service';
import { KeyLabel,Filter,ArtistEvents } from '../../services/interfaces';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrl: './program.component.css'
})
export class ProgramComponent {  
  private _days:KeyLabel[]=[];
  private _types:KeyLabel[]=[]; // event type such as concert, rencontre ...
  isRotated:boolean[]=[false,false];
  private _filter:Filter={} as Filter;

  private _events:ArtistEvents[]=[];  

  constructor(private service:DataService){
    //initialize filter 
    this._days.push({key:"all",label:"tous"});
    service.dates.days.split(",").map((day,idx) => {
      this._days.push({key:`day${idx+1}`,label:`${day} ${service.dates.month}`});
    });
    this._types.push({key:"all",label:"tous"});
    service.event_types.map((type) => {
      this._types.push({key:type.id,label:type.description});
    });
    this._filter=this.getDefaultFilter();
    console.log(this._filter)
    //format raw events data
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
      artistEvts.dates=_.orderBy(artistEvts.dates,"date","asc")  
    });    
    return _.orderBy(AllArtistEvents, "performer.name", "asc");
  }
  get days(){
    return this._days;
  }
  get types(){
    return this._types;
  }
  get filter(){
    return this._filter;
  }
  get events():ArtistEvents[]{
    return this._events;
  }

  getDefaultFilter():Filter{
    const days:any={} ;
    this._days.map((day:KeyLabel) => {
      days[day.key]=false;
    });
    days.all=true;
    const types:any={};
    this._types.map((type:KeyLabel) => {
      types[type.key]=false;
    });
    types.all=true;
    return {days,types} as Filter;
  }

  handleFilterChange(form:NgForm){

  }
  filterReset (form:NgForm) {

  }
  rotateChevron(idx:number) {
    this.isRotated[idx]=!this.isRotated[idx];
  }
  setRotatingChevron(bl:boolean){
    this.isRotated=[bl,bl];
  }
  @HostListener('window:resize', ['$event'])
    onWindowResize() {
      this.setRotatingChevron(window.outerWidth>=576?true:false);
  }
}