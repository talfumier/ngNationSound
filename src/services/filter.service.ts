import {Injectable, inject} from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import _ from "lodash";
import { DataService } from './data.service';
import { FormFilterElements,Filter,Event, Option, KeyLabel } from './interfaces';
import { getDateFromString } from '../app/utilities/functions/utlityFunctions';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private _formFilterElements:FormFilterElements={} as FormFilterElements;
  private _defaultFilter:Filter={} as Filter; //{days:{},time:{},types:{},artist:{}};
  private _filteredEvents:Event[]=[];
  private _filter:Filter={} as Filter;

  constructor(private service:DataService) { }

  get filteredEvents(){
    return this._filteredEvents;
  }
  // set filteredEvents(data) {
  //   this._filteredEvents=data;
  // }
  get formFilterElements(){
    return this._formFilterElements;
  }
  get defaultFilter():Filter {
    return this._defaultFilter;
  }
  get filter():Filter{
    return this._filter;
  }
  set filter(data){
    this._filter=data;
  }
  setFormFilterElements(){  //initialize form filter elements in program page and set default filter
    const days=[];
    days.push({key:"all",label:"tous"});
    this.service.dates.days.split(",").map((day,idx) => {
      days.push({
        key:`day${idx+1}`,
        label:`${new Date(this.service.dates.month +" "+day+","+this.service.dates.year).toLocaleDateString("fr",{day:"numeric",month: "long"})}`});
    });
    const types=[];
    types.push({key:"all",label:"tous"});
    this.service.event_types.map((type) => {
      types.push({key:type.id,label:type.description});
    });
    const times=[{key:"min",label:"de"},{key:"max",label:"à"}];
    const opts:Option[]=[],obj={id:-1,name:""}; //obj is the default option
    new Array(13).fill(11).map((item,idx) => opts.push({id:`${item+idx}h00`,name:`${item+idx}h00`}));
    const timeOptions={min:[obj,...opts],max:[obj,...opts]};

    const artist={key:"id",label:""};
    const artistOptions=[];
    artistOptions.push(obj);
    this.service.artists.map((artist) => {
      artistOptions.push({id:artist.id,name:artist.name});
    });
    this._formFilterElements={days,types,times,timeOptions,artist,artistOptions};
    //init default filter
    let ob:any={}
    days.map((day:KeyLabel) => {
      ob[day.key]=false;
    });
    ob.all=true;
    this._defaultFilter.days=ob;

    ob={};
    types.map((type:KeyLabel) => {
      ob[type.key]=false;
    });
    ob.all=true; 
    this._defaultFilter.types=ob;   

    ob={};
    times.map((tm) => {
      ob[tm.key]=-1;
    });
    this._defaultFilter={...this._defaultFilter,time:ob,artist:{id:-1}};
    this._filter=this._defaultFilter;
  }
  async filterEvent(bl:boolean[],x:any,dates:any,result:Event[],event:Event){
    bl.fill(false);
    x=getDateFromString(event.date,"dd.mm.yyyy hh:mm","ms"); //event date and time in milliseconds
    Object.keys(dates).map((key) => {
      if(key!=="time" && !bl[0] && x>=dates[key]+dates.time.min && x<=dates[key]+dates.time.max) 
        bl[0]=true;
    });
    // dealing with 'Quoi ?' filter
    if(this._filter.types["all" as keyof object]) 
      bl[1]=true;
    else if(!bl[1]){
      Object.keys(this._filter.types).map((key:any) => {
        if(key!=="all" && !bl[1] && this._filter.types[key as keyof object] && event.type.id==key )
          bl[1]=true;
      });
    }
    // dealing with 'Qui ?' filter
    if(this._filter.artist["id" as keyof object]===-1)        
      bl[2]=true;
    if(!bl[2] && this._filter.artist["id" as keyof object]==event.performer.id)
      bl[2]=true

    if(JSON.stringify(bl).indexOf("false")===-1)
      result.push(event); 
  }
  async setFilteredEvents(fltr?:Filter):Promise<void> {    
    new Promise((resolve,reject) => {
      if(Object.keys(this._filter).length===0) this.setFormFilterElements();
      // if(_.isEqual(filter,this._activeFilter)) return; //Deep comparison active vs new filter, if no difference no need to re-filter data  
      let dates:any={},x:any="";    
      //dates > object that initially contains event festival dates in milliseconds (set at 00:00:00 time)    
      Object.values(this.service.dates)[0].split(",").map((day:string,idx:number) => {
          dates[`day${idx+1}`]= Date.parse(day+this.service.dates.month+this.service.dates.year);
        });
      dates.time={min:0,max:24*3600*1000}; //time range with no restriction (milliseconds)
      if(!this._filter.days["all" as keyof object]){ //when all:true, keep all dates
        Object.keys(this._filter.days).map((key:string) => { //dealing with "Quand ?" filter
          switch(key){
            case "all": //do nothing
              break;
            default: //remove date when filter 'dayx' is false
              if(!this._filter.days[key as keyof object])
                delete dates[key];
          }
        });
      }
      ["min","max"].map((key) => { //dealing with 'A quelle heure ?' filter
        x=this._filter.time[key as keyof object];
        if(x!==-1) //-1 is default value
          dates.time[key]=parseInt(x.split("h")[0])*3600*1000; //time in milliseconds
      });
      let bl=new Array(3); const result:Event[]=[];
      Promise.all(
        this.service.events.map(async(event) => {
          await this.filterEvent(bl,x,dates,result,event);
        }));          
      resolve(result);      
    }).then((result) => {
      this._filteredEvents=result as Event[];
      // console.log("getFilteredEvents.then",this._filter,(result as Event[]).length,this._filteredEvents.length)
      window.alert((result as Event[]).length+" - "+this._filteredEvents.length)
    }).catch((error) => {
      window.alert(error)
    })    
  }
}

export const eventsResolver: ResolveFn<Promise<void>> =  //program page resolver
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject (FilterService).setFilteredEvents();
};




