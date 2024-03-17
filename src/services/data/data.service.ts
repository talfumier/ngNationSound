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
    messages:[],
    dates:{} as Dates,
    pois:[],
    artists:[],
    infos:{} as Infos,
    faqs:[],
    partners:[],
    passes:[],
    events:[],
    umap_pois:{}
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
    _.range(this._data.dates.start_date.getDate(),this._data.dates.end_date.getDate()+1).map((day) => {
      this._innerHTML.push(`${new Date(this._data.dates.start_date.getMonth()+" " +day+","+this._data.dates.start_date.getFullYear()).toLocaleString("fr-FR",{day: 'numeric',month:"long"})}`);
    });
    this._innerHTML.map((item,idx) => {
      this._innerHTML[idx]=`<div class='column-header'>${item}</div>`
    });

    const stages=_.filter(this._data.pois,(poi) => {
      return poi.type==="stage";
    });   
    let day="", ul="",artist="";
    // console.log(stages)
    stages.map((stage) => {
      this._innerHTML.push(`<div class=row-header><a href=/map/${removeAccents(stage.name)}>${stage.name}</a></div>`);
      day="",ul="";
      _.filter(this._data.events,(evt) => {
        return evt.location===stage.id;
      }).map((evt) => {
        if((environment.apiMode==="local"?evt.date.slice(0,2):new Date(evt.date).getDate().toString())!==day){
          if(ul.length>0) this._innerHTML.push(ul+"</ul>");        
          ul="<ul class='list-group-program'>";
          day=environment.apiMode==="local"?evt.date.slice(0,2):new Date(evt.date).getDate().toString();
        }
        artist=_.filter(this._data.artists,(item) => {
          return item.id===evt.performer
        })[0].name;
        ul=ul+`<li class='list-group-item-program'>${(environment.apiMode==="local"?evt.date.slice(-5):evt.date.slice(-8,-3)).replace(":","h")} : <a href=/artist/${evt.performer}>${artist}</a></li>`
      });
      if(ul.length>0) this._innerHTML.push(ul+"</ul>");  
    });
  }
  getArtistById(id:number):Artist{
    return _.filter(this._data.artists,(artist) => {
      return artist.id===id;
    })[0];
  }
  get data(){
    return this._data;
  }
  set data(dta) {
    this._data=dta;
  }
  get messages (){
    return this._data.messages;
  }
  get innerHTML():string[]{
    return this._innerHTML
  }  
  get dates():Dates{
    return this._data.dates;
  }
  get pois():Poi[]{
    return this._data.pois;
  }
  get artists():Artist[]{
    return this._data.artists;
  }
  get events():Event[]{
    return this._data.events;
  }
  get infos():Infos {
    return this._data.infos;
  }
  get faqs() {
    return this._data.faqs;
  }
  get partners(){
    return this._data.partners;
  }
  get passes(){
    return this._data.passes;
  }
  get umap_pois(){
    return this._data.umap_pois;
  }
}