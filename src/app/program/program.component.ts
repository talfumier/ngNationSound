import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import _ from 'lodash';
import {FormFilterElements, Filter,ArtistEvents,Poi } from '../../services/interfaces';
import { FilterService } from '../../services/filter.service';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrl: './program.component.css'
})
export class ProgramComponent implements OnInit, AfterViewInit,OnDestroy {  
  private _cats:string[]=["Quand ?","A quelle heure ?","Quoi ?","Qui ?"];
  private _activeSubform:number=-1;
  private _formFilterElements:FormFilterElements={} as FormFilterElements;
  private _filter:Filter={} as Filter;  
  private _isFiltered:boolean[]=[];
  static scrollY:number;
  
  @ViewChild('tooltip') tooltip: ElementRef={} as ElementRef;

  private _events:ArtistEvents[]=[];  

  constructor(private dataService:DataService,private filterService:FilterService){}

  get cats(){
    return this._cats;
  }
  get activeSubform(){
    return this._activeSubform;
  }
  get formFilterElements(){
    return this._formFilterElements;
  }
  get isFiltered(){
    return this._isFiltered;
  }

  ngOnInit(): void {    
    this._formFilterElements=this.filterService.formFilterElements;  //initialize form filter elements
    this._filter=this.filterService.filter;  //initialize filter
    this._events=this.getFormattedData(this.filterService.filteredEvents);  //format raw events data
    if(window.innerWidth>=1500) this._activeSubform=100;
    this.setIsFiltered();
  }
  setIsFiltered (){
   this._isFiltered=[
      !this._filter.days["all" as keyof object],
      !_.isEqual(Object.values(this._filter["time" as keyof object]),[-1,-1]),
      !this._filter.types["all" as keyof object],
      this._filter.artist["id" as keyof object]!==-1
    ];  
  }
  ngAfterViewInit(): void {    
    setTimeout(() => {
      window.scrollTo(0,ProgramComponent.scrollY);     
    },100);     
  }
  ngOnDestroy(): void {
    ProgramComponent.scrollY=window.scrollY; // record scroll position to be able to return at the same position
  }
  getFormattedData(evts:any[]){
    evts=evts.map((evt:any) => { //populate events with artist and location data
      return(
        {
          performer:_.filter(this.dataService.artists,(artist) => {
              return artist.id===evt.performer;
            })[0],
          type:evt.type,
          location:_.filter(this.dataService.pois,(poi) => {
              return poi.id===evt.location;
            })[0],
          date:evt.date,
        });
    });
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
      artistEvts.dates.push({date:evt.date,location:evt.location as Poi,type:evt.type});
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
  handleCatClick(evt:Event,idx:number) {    
    if(window.innerWidth>=1500) return; //filter form always visible on large screen devices
    evt.stopPropagation();
    this._activeSubform=idx;
  }
  handleFilterChange(form:NgForm){   
    let cats:object={};
    ["days","types"].map((it:string) => {
      cats={...form.value[it]};
      if(form.value[it].all) {
        if(!this._filter[it as keyof Filter]["all" as keyof object]){
          cats=this.filterService.defaultFilter[it as keyof Filter];
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
    this.filterService.nochange=false;
    this.filterService.setFilteredEvents();
    this._events=this.getFormattedData(this.filterService.filteredEvents);   
    
    this.setIsFiltered(); 
  }
  filterReset (form:NgForm) {
    form.setValue(this.filterService.defaultFilter);
    this._filter=this.filterService.defaultFilter;  
    this.filterService.filter=this._filter;
    this.filterService.filteredEvents=this.dataService.events;
    this._events=this.getFormattedData(this.dataService.events);

    this.setIsFiltered();
  }
  handleMouseEvent(cs:number) {
    this.tooltip.nativeElement.classList.replace(`${cs===1?"hidden":"visible"}`,`${cs===1?"visible":"hidden"}`);
  }
}
