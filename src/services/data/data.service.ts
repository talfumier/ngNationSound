import {Injectable} from '@angular/core';
import _ from "lodash";
import { Poi, Dates, Artist, Event, Infos, Model } from '../interfaces';
import { environment } from '../../config/environment';
import { getLocalData } from './init/local';
import { removeAccents} from '../../app/utilities/functions/utlityFunctions';

@Injectable({
  providedIn: 'root' // single instance for the entire application
})
export class DataService { 
  private _innerHTML:string[]=[];// data formatting as html string for use in events summary (home page)
  private _data:Model={
    messages:{data:[],ready:false},
    dates:{data:{} as Dates,ready:false},
    pois:{data:[],ready:false},
    artists:{data:[],ready:false},
    infos:{data:{} as Infos,ready:false},
    faqs:{data:[],ready:false},
    partners:{data:[],ready:false},
    passes:{data:[],ready:false},
    events:{data:[],ready:false},
    umap_pois:{url:"",data:{},ready:false}
  }

  constructor() {
    if(environment.apiMode==="local") this.loadLocalData();
  }
  
  loadLocalData(){   
    this._data=getLocalData();
    this.initInnerHTML();
  }
  initInnerHTML(){    // data formatted as html string for use in events summary (home page)
    this._innerHTML=[""];
    _.range(this._data.dates.data.start_date.getDate(),this._data.dates.data.end_date.getDate()+1).map((day) => {
      //(this._data.dates.data.start_date.getMonth()+1)+" " +day+","+this._data.dates.data.start_date.getFullYear()
      this._innerHTML.push(`${new Date(this._data.dates.data.start_date.getFullYear(),
        this._data.dates.data.start_date.getMonth(),day).toLocaleString("fr-FR",{day: 'numeric',month:"long"})}`);
    });
    this._innerHTML.map((item,idx) => {
      this._innerHTML[idx]=`<div class='column-header'>${item}</div>`
    });

    const stages=_.filter(this._data.pois.data,(poi) => {
      return poi.type==="stage";
    });   
    let day="", ul="",artist="";
    stages.map((stage) => {
      this._innerHTML.push(`<div class=row-header><a href=/map/${removeAccents(stage.name)}>${stage.name}</a></div>`);
      day="",ul="";
      _.sortBy(_.filter(this._data.events.data,(evt) => {
        return evt.location===stage.id;
      }),"date","asc").map((evt) => {
        if((environment.apiMode==="local"?evt.date.slice(0,2):new Date(evt.date).getDate().toString())!==day){
          if(ul.length>0) this._innerHTML.push(ul+"</ul>");        
          ul="<ul class='list-group-program'>";
          day=environment.apiMode==="local"?evt.date.slice(0,2):new Date(evt.date).getDate().toString();
        }
        artist=_.filter(this._data.artists.data,(item) => {
          return item.id===evt.performer;
        })[0].name;
        ul=ul+`<li class='list-group-item-program'>${(environment.apiMode==="local"?evt.date.slice(-5):evt.date.slice(-8,-3)).replace(":","h")} : <a href=/artist/${evt.performer}>${artist}</a></li>`
      });
      if(ul.length>0) this._innerHTML.push(ul+"</ul>");  
    });
  }
  getArtistById(id:number):Artist{
    return _.filter(this._data.artists.data,(artist) => {
      return artist.id===id;
    })[0];
  }
  displayLoading(cs:boolean){
    const elt=document.getElementById("splashScreen");
    if(cs) elt?.classList.remove("hidden");
    else elt?.classList.add("hidden");
  }
  get data(){
    return this._data;
  }
  set data(dta) {
    this._data=dta;
  }
  get messages (){
    return this._data.messages.data;
  }
  get innerHTML():string[]{
    return this._innerHTML
  }  
  get dates():Dates{
    return this._data.dates.data;
  }
  get pois():Poi[]{
    return this._data.pois.data;
  }
  get artists():Artist[]{
    return this._data.artists.data;
  }
  get events():Event[]{
    return this._data.events.data;
  }
  get infos():Infos {
    return this._data.infos.data;
  }
  get faqs() {
    return this._data.faqs.data;
  }
  get partners(){
    return this._data.partners.data;
  }
  get passes(){
    return this._data.passes.data;
  }
  get umap_pois(){
    return this._data.umap_pois.data;
  }
}