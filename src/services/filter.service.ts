import {Injectable} from '@angular/core';
import _ from "lodash";
import { DataService } from './data.service';
import { Filter,Event } from './interfaces';
import { getDateFromString } from '../app/utilities/functions/utlityFunctions';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private _filteredEvents:Event[]=[];
  private _activeFilter:Filter={} as Filter;//{days:{},time:{},types:{},artist:{}};

  constructor(private service:DataService) { }

  get filteredEvents(){
  return this._filteredEvents;
  }
  get activeFilter():Filter{
    return this._activeFilter;
  }
  set activeFilter(data){
    this._activeFilter=data;
  }
  
  setFilteredEvents(filter:Filter):void{
    // if(_.isEqual(filter,this._activeFilter)) return; //Deep comparison active vs new filter, if no difference no need to re-filter data  
    let dates:any={},x:any="";    
    //dates > object that initially contains event festival dates in milliseconds (set at 00:00:00 time)    
    Object.values(this.service.dates)[0].split(",").map((day:string,idx:number) => {
        dates[`day${idx+1}`]= Date.parse(day+this.service.dates.month+this.service.dates.year);
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
    this.service.events.map((event) => {
      bl.fill(false);
      x=getDateFromString(event.date,"dd.mm.yyyy hh:mm","ms"); //event date and time in milliseconds
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

      if(JSON.stringify(bl).indexOf("false")===-1)
        result.push(event); 
    });
    this._filteredEvents=result;
    this._activeFilter=filter;
  }
}




