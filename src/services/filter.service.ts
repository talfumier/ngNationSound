import {Injectable} from '@angular/core';
import _ from "lodash";
import { addDays, format } from 'date-fns';
import { DataService } from './data/data.service';
import { addHours,parse } from 'date-fns';
import { FormFilterElements,Filter,Event, Option, KeyLabel } from './interfaces';
import { environment } from '../config/environment';

@Injectable({
  providedIn: 'root'  // single instance for the entire application
})
export class FilterService {
  private _formFilterElements:FormFilterElements={} as FormFilterElements;
  private _defaultFilter:Filter={} as Filter; //{days:{},time:{},types:{},artist:{}};
  private _filteredEvents:Event[]=[];
  private _filter:Filter={} as Filter;
  private _nochange:boolean=false; //flag to monitor actual change in filter settings

  constructor(private dataService:DataService) { }

  get filteredEvents(){
    return this._filteredEvents;
  }
  set filteredEvents(data) {
    this._filteredEvents=data;
  }
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
  get nochange() {
    return this._nochange;
  }
  set nochange(status:boolean) {
    this._nochange=status;
  }
  setFormFilterElements(){  //initialize form filter elements in program page and set default filter
    const days=[];
    days.push({key:"all",label:"tous"}); 
    _.range(this.dataService.dates.start_date.getDate(),this.dataService.dates.end_date.getDate()+1).map((day,idx) => {
      days.push({
        key:`day${idx+1}`,
        // label:`${new Date((this.dataService.dates.start_date.getMonth()+1) +" "+day+","+this.dataService.dates.start_date.getFullYear())
        // .toLocaleDateString("fr",{day:"numeric",month: "long"})}`
         label:format(new Date(this.dataService.dates.start_date.getFullYear(), //work-around to avoid 'invalid date' warning on ios devices
      this.dataService.dates.start_date.getMonth(),day),"dd MMMM"),
      });
        
      });

    const arr:any=new Set();
    this.dataService.events.map((evt) => {
      arr.add(evt.type);
    });
    const types=[];
    types.push({key:"all",label:"tous"});
    arr.forEach((type:string) => {
      types.push({key:type,label:type})
    }) 
    
    const times=[{key:"min",label:"de"},{key:"max",label:"à"}];
    const opts:Option[]=[],obj={id:-1,name:""}; //obj is the default option
    new Array(13).fill(11).map((item,idx) => opts.push({id:`${item+idx}h00`,name:`${item+idx}h00`}));
    const timeOptions={min:[obj,...opts],max:[obj,...opts]};

    const artist={key:"id",label:""};
    const artistOptions=[];
    artistOptions.push(obj);
    this.dataService.artists.map((artist) => {
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
  filterEvent(dates:any,event:Event):boolean {
    const bl=new Array(3);
    bl.fill(false);
    // dealing with 'Quand ? A quelle heure ?' filter
    const fmt=environment.apiMode==="local"?"dd.MM.yyyy HH:mm":"yyyy-MM-dd HH:mm:ss";//date parameter format
    const evtDate=parse(event.date,fmt,new Date());
    Object.keys(dates).map((key:string) => {
      if(key!=="time" && !bl[0] && evtDate>=addHours(dates[key],dates.time.min) && evtDate<=addHours(dates[key],dates.time.max))
        bl[0]=true;
    });
    if(!bl[0]) return false;
      // dealing with 'Quoi ?' filter
    if(this._filter.types["all" as keyof object]) 
      bl[1]=true;
    else if(!bl[1]){
      Object.keys(this._filter.types).map((key:any) => {
        if(key!=="all" && !bl[1] && this._filter.types[key as keyof object] && event.type===key )
          bl[1]=true;
      });
    }
    if(!bl[1]) return false;
    // dealing with 'Qui ?' filter
    if(this._filter.artist["id" as keyof object]==-1 || this._filter.artist["id" as keyof object]==="")        
      bl[2]=true;
    if(!bl[2] && this._filter.artist["id" as keyof object]==event.performer)
      bl[2]=true; 
    if(!bl[2]) return false;
    return true;
  }
  setFilteredEvents():void {  
    if(this._nochange) return; //no filter settings change > no need to re-run function      
    if(Object.keys(this._filter).length===0) this.setFormFilterElements();   
    const dates:any={}; let x:any="";    
    //dates > object that initially contains event festival dates (set at 00:00:00 time) 
    dates.time={min:0,max:24}; //time range with no restric  
    _.range(this.dataService.dates.start_date.getDate(),this.dataService.dates.end_date.getDate()+1).map((day:number,idx:number) => {
        dates[`day${idx+1}`]=addDays(this.dataService.dates.start_date,idx);
      });
    dates.time={min:0,max:24}; //time range with no restriction (hours)
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
        dates.time[key]=parseInt(x.split("h")[0]); //time in hours
    });    
    this._filteredEvents=_.filter(this.dataService.events,(event) => {
      return this.filterEvent(dates,event); 
    });
    this._nochange=true;
  }
}




