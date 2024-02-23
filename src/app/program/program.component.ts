import { Component,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import _ from 'lodash';
import {FormFilterElements, Filter,ArtistEvents,Poi,EventType } from '../../services/interfaces';
import { getDateFromString } from '../utilities/functions/utlityFunctions';
import { FilterService } from '../../services/filter.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrl: './program.component.css'
})
export class ProgramComponent implements OnInit {  
  private _formFilterElements:FormFilterElements={} as FormFilterElements;
  isRotated:boolean=false;
  private _filter:Filter={} as Filter;

  private _events:ArtistEvents[]=[];  

  constructor(private dataService:DataService,private filterService:FilterService, private activatedRoute: ActivatedRoute){ }

  get formFilterElements(){
    return this._formFilterElements;
  }

  ngOnInit(): void {    
    this.activatedRoute.data.subscribe(({events}) => { //resolved raw events data from eventsResolver      
      this._formFilterElements=this.filterService.formFilterElements;  //initialize form filter elements
      this._filter=this.filterService.filter;  //initialize filter
      // window.alert(this.filterService.filteredEvents.length)
      this._events=this.getFormattedData(this.filterService.filteredEvents);  //format raw events data
    });
  }
  getFormattedData(evts:any[]){
    const AllArtistEvents:ArtistEvents[]=[];
    let artistEvts:ArtistEvents={} as ArtistEvents,i=null;
    evts.map((evt:any) => {
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
  get filter(){
    return this._filter;
  }
  get events():ArtistEvents[]{
    return this._events;
  }
  async handleFilterChange(form:NgForm){
    let cats:object={};
    ["days","types"].map((it:string) => {
      cats={...form.value[it]};
      if(form.value[it].all) {
        if(!this._filter[it as keyof Filter]["all" as keyof object]){
          cats=this.filterService.formFilterElements[it as keyof object];
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
    
    this.filterService.filter=this._filter;
    await this.filterService.setFilteredEvents();
    this._events=this.getFormattedData(this.filterService.filteredEvents);
  }
  async filterReset (form:NgForm) {
    form.setValue(this.filterService.defaultFilter);
    this._filter={...form.value};  
    this.filterService.filter=this._filter;
    await this.filterService.setFilteredEvents();
    this._events=this.getFormattedData(this.dataService.events);
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
