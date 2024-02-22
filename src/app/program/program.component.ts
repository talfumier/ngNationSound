import {Injectable, inject} from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Component,OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import _ from 'lodash';
import { DataService } from '../../services/data.service';
import { KeyLabel,Filter,ArtistEvents, TimeOptions, Option, Poi, EventType } from '../../services/interfaces';
import { getDateFromString } from '../utilities/functions/utlityFunctions';
import { FilterService } from '../../services/filter.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrl: './program.component.css'
})
export class ProgramComponent implements OnInit {  
  private _days:KeyLabel[]=[];
  private _types:KeyLabel[]=[]; // event type such as concert, rencontre ...
  private _times:KeyLabel[]=[];
  private _timeOptions:TimeOptions={} as TimeOptions;
  private _artist:KeyLabel={} as KeyLabel;
  private _artistOptions:Option[]=[];
  isRotated:boolean=false;
  private _filter:Filter={} as Filter;

  private _events:ArtistEvents[]=[];  

  constructor(private dataService:DataService,private filterService:FilterService){   
     //initialize filter
    const cond=Object.keys(this.filterService.activeFilter).length>0;
    if(cond) this._filter=this.filterService.activeFilter;
    this.initFilter(cond?"":"default"); 
    console.log("const",this.filterService.activeFilter,cond)
    }

  initFilterEvents(){ //filtered data required before page loading (asynchronous)     
    this.filterService.setFilteredEvents(this._filter); //initialize raw events data
    console.log("initFilterEvents",this.filterService.filteredEvents)    
  }

  ngOnInit(): void {    
    console.log("format")
    this._events=this.getFormattedData();  //format raw events data
  }
  getFormattedData(){
      
    window.alert(this.dataService.events.length + "-"+ this.filterService.filteredEvents.length)
    const AllArtistEvents:ArtistEvents[]=[];
    let artistEvts:ArtistEvents={} as ArtistEvents,i=null;
    this.filterService.filteredEvents.map((evt) => {
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
      artistEvts.dates.push({date:getDateFromString(evt.date,"dd.mm.yyyy hh:mm") as Date,location:evt.location as Poi,type:evt.type as EventType});

      if(i===-1) AllArtistEvents.push(artistEvts);
      else AllArtistEvents[i]=artistEvts;  
      artistEvts.dates=_.orderBy(artistEvts.dates,"date","asc")  
    });    
    return _.orderBy(AllArtistEvents, "performer.name", "asc");
  }
  get days(){
    return this._days;
  }
  get times() {
    return this._times
  }
  get timeOptions(){
    return this._timeOptions
  }
  get types(){
    return this._types;
  }
  get artist(){
    return this._artist;
  }
  get artistOptions(){
    return this._artistOptions;
  }
  get filter(){
    return this._filter;
  }
  get events():ArtistEvents[]{
    return this._events;
  }

  initFilter(cs?:string){
    this._days=[];
    this._days.push({key:"all",label:"tous"});
    this.dataService.dates.days.split(",").map((day,idx) => {
      this._days.push({
        key:`day${idx+1}`,
        label:`${new Date(this.dataService.dates.month +" "+day+","+this.dataService.dates.year).toLocaleDateString("fr",{day:"numeric",month: "long"})}`});
    });
    this._types=[];
    this._types.push({key:"all",label:"tous"});
    this.dataService.event_types.map((type) => {
      this._types.push({key:type.id,label:type.description});
    });
    this._times=[{key:"min",label:"de"},{key:"max",label:"à"}];
    const opts:Option[]=[],obj={id:-1,name:""}; //obj is the default option
    new Array(13).fill(11).map((item,idx) => opts.push({id:`${item+idx}h00`,name:`${item+idx}h00`}));
    this._timeOptions={min:[obj,...opts],max:[obj,...opts]};

    this._artist={key:"id",label:""};
    this._artistOptions.push(obj);
    this.dataService.artists.map((artist) => {
      this._artistOptions.push({id:artist.id,name:artist.name});
    });

    if(cs==="default") {
      this._filter=this.getDefaultFilter("all");
      this.filterService.activeFilter=this.getDefaultFilter("all");
    }
  }
  getDefaultFilter(cs:string):Filter{
    const days:any={} ;
    this._days.map((day:KeyLabel) => {
      days[day.key]=false;
    });
    days.all=true;
    if(cs==="days") return days;

    const types:any={};
    this._types.map((type:KeyLabel) => {
      types[type.key]=false;
    });
    types.all=true;    
    if(cs==="types") return types;

    const time:any={};
    this._times.map((tm) => {
      time[tm.key]=-1;
    });

    return {days,types,time,artist:{id:-1}} as Filter;
  }
  handleFilterChange(form:NgForm){
    let cats:object={};
    ["days","types"].map((it:string) => {
      cats={...form.value[it]};
      if(form.value[it].all) {
        if(!this._filter[it as keyof Filter]["all" as keyof object]){
          cats=this.getDefaultFilter(it);
          form.setValue({...form.value,[it]:cats});
        }
        if(JSON.stringify(form.value[it]).split("true").length>2) {
          cats={...form.value[it],all:false};
          form.setValue({...form.value,[it]:cats})
        }
      }    
      this._filter={...this._filter,[it]:cats};  
    }); 
    this._filter.time=form.value.time;   
    this._filter.artist=form.value.artist;

    this.filterService.setFilteredEvents(this._filter);
    this._events=this.getFormattedData();
  }
  filterReset (form:NgForm) {
    form.setValue(this.getDefaultFilter("all"));
    this._filter={...form.value};     
    this.filterService.setFilteredEvents(this._filter); 
    this._events=this.getFormattedData();
  }
  rotateChevron(evt?:Event) {
    evt?.stopPropagation();
    this.isRotated=!this.isRotated;
  }
  setRotatingChevron(bl:boolean){
    this.isRotated=bl;
  }
  closeForm(){
    if(!this.isRotated) return;
    this.rotateChevron();
  }
  formClick(evt:Event){    
    evt.stopPropagation();
  }
}

export const filterResolver: ResolveFn<void> =  //program page resolver
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject (ProgramComponent).initFilterEvents();
};
