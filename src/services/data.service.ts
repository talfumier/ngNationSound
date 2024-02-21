import { Injectable } from '@angular/core';
import _ from "lodash";
import {Poi,Dates,Artist,Style,Event, EventType, Filter} from "./interfaces";
import data from "./data.json";
import { removeAccents } from './../app/utilities/functions/utlityFunctions';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _innerHTML:string[]=[];// data formatting as html string for use in events summary (home page)
  private _dates:Dates={} as Dates;
  private _event_types:EventType[]=[];
  private _pois:Poi[]=[];
  private _artists:Artist[]=[];
  private _styles:Style[]=[];
  private _events:Event[]=[];
  
  private _filteredEvents:Event[]=[];
  private _activeFilter:Filter={} as Filter;

  constructor(){
    this.initData();
  }
  
  initData(){ 
    this._dates=data.dates[0];
    this._event_types=data.event_types;
    this._pois=data.pois;
    this._artists=data.artists;
    this._styles=data.cat;
    this.initInnerHTML();
    this.initEvents();
  }
  initInnerHTML(){    // data formatted as html string for use in events summary (home page)
    this._innerHTML=[""];
    this._dates.days.split(",").map((day) => {
      this._innerHTML.push(`${new Date(this._dates.month +day+","+this._dates.year).toLocaleString("fr-FR",{day: 'numeric',month:"long"})}`);
    });
    this._innerHTML.map((item,idx) => {
      this._innerHTML[idx]=`<div class='column-header'>${item}</div>`
    });

    const stages=_.filter(this._pois,(poi) => {
      return poi.type==="stage";
    });   
    let day="", ul="",artist="";
    stages.map((stage) => {
      this._innerHTML.push(`<div class=row-header><a href=/map/${removeAccents(stage.name)}/program>${stage.name}</a></div>`);
      day="",ul="";
      _.filter(data.events,(evt) => {
        return evt.location===stage.id && evt.type===1;
      }).map((evt) => {
        if(evt.date.slice(0,2)!==day){
          if(ul.length>0) this._innerHTML.push(ul+"</ul>");        
          ul="<ul class='list-group-program'>";
          day=evt.date.slice(0,2); 
        }
        artist=_.filter(this._artists,(item) => {
          return item.id===evt.performer
        })[0].name;
        ul=ul+`<li class='list-group-item-program'>${evt.date.slice(-5).replace(":","h")} : <a href=/artist/${evt.performer}/program>${artist}</a></li>`
      });
      if(ul.length>0) this._innerHTML.push(ul+"</ul>");  
    });
  }
  initEvents(){
    data.events.map((evt) => {
      this._events.push(
        {
          performer:_.filter(this._artists,(artist) => {
              return artist.id===evt.performer;
            })[0],
          type:_.filter(data.event_types,(type) => {
            return type.id===evt.type;
          })[0],
          location:_.filter(this._pois,(poi) => {
              return poi.id===evt.location;
            })[0],
          date:evt.date
        });
    });
  }
  
  getArtistById(id:number):Artist{
    return _.filter(this._artists,(artist) => {
      return artist.id===id;
    })[0];
  }

  get innerHTML():string[]{
    return this._innerHTML
  }  
  get dates():Dates{
    return this._dates;
  }
  get event_types():EventType[]{
    return this._event_types;
  }
  get pois():Poi[]{
    return this._pois;
  }
  get artists():Artist[]{
    return this._artists;
  }
  get styles():Style[] {
    return this._styles
  }
  get events():Event[]{
    return this._events;
  }

  get filteredEvents(){
  return this._filteredEvents;
  }
  set filteredEvents(data:Event[]){
    this._filteredEvents=data;
  }
  get activeFilter():Filter{
    return this._activeFilter;
  }
  setFilteredEvents(filter:Filter):void{
    if(_.isEqual(filter,this._activeFilter)) return; //Deep comparison active vs new filter, if no difference no need to re-filter data   
    let dates:any={},x:any="";    
    //dates > object that initially contains event festival dates in milliseconds (set at 00:00:00 time)    
    Object.values(this._dates)[0].split(",").map((day:string,idx:number) => {
        dates[`day${idx+1}`]= Date.parse(day+this._dates.month+this._dates.year);
      });
    dates.time={min:0,max:24*3600*1000}; //time range with no restriction (milliseconds)
    if(!filter.days["all" as keyof object]){ //when all:true, keep all dates
      Object.keys(filter.days).map((key:string) => { //dealing with "Quand ?" filter
        switch(key){
          case "all": //do nothing
            break;
          default: //remove date when filter 'dayx' is false
            if(!filter.days[key as keyof object])
              delete dates[key];
        }
      });
    }
    ["min","max"].map((key) => { //dealing with 'A quelle heure ?' filter
      x=filter.time[key as keyof object];
      if(x!==-1) //-1 is default value
        dates.time[key]=parseInt(x.split("h")[0])*3600*1000; //time in milliseconds
    });
    let bl=new Array(3); const result:Event[]=[];
    this._events.map((event) => {
      bl.fill(false);
      x=this.getDateFromString(event.date,"dd.mm.yyyy hh:mm","ms"); //event date and time in milliseconds
      Object.keys(dates).map((key) => {
        if(key!=="time" && !bl[0] && x>=dates[key]+dates.time.min && x<=dates[key]+dates.time.max) 
          bl[0]=true;
      });
      // dealing with 'Quoi ?' filter
      if(filter.types["all" as keyof object]) 
        bl[1]=true;
      else if(!bl[1]){
        Object.keys(filter.types).map((key:any) => {
          if(key!=="all" && !bl[1] && filter.types[key as keyof object] && event.type.id==key )
            bl[1]=true;
        });
      }
      // dealing with 'Qui ?' filter
      if(filter.artist["id" as keyof object]===-1)        
        bl[2]=true;
      if(!bl[2] && filter.artist["id" as keyof object]==event.performer.id)
        bl[2]=true

      // if(JSON.stringify(bl).indexOf("false")===-1)
        result.push(event); 
    });
    this._filteredEvents=result;
    window.alert(this._filteredEvents.length)
    this._activeFilter=filter;
  }
  getDateFromString(date:any,format:string,output?:string):Date|number {
    let result:any=null;
    switch(format){
      case "dd.mm.yyyy hh:mm":
        result=date.toString().split(" ")[0].split(".");
        const x=result[0];
        result[0]=result[1],result[1]=x;
        result[3]=date.toString().split(" ")[1];
        result=result.join();
        break;
    } 
    return output==="ms"?Date.parse(result):new Date(result);
  }
}
