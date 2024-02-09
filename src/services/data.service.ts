import { Injectable } from '@angular/core';
import _ from "lodash";
import data from "./data.json";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _innerHTML:string[]=[];
  private _pois:Poi[]=[];
  private _artists:Artist[]=[];

  constructor(){
    this.initData();
  }
  
  initData(){ 
    const result:any[]=["","14 Juin","15 Juin","16 Juin"];
    result.map((item,idx) => {
      result[idx]=`<div class='column-header'>${item}</div>`
    });
    this._pois=data.pois;
    const stages=_.filter(this._pois,(poi) => {
      return poi.type==="stage";
    });    
    this._artists=data.artists;
    let day="", ul="",artist="";
    stages.map((stage) => {
      result.push(`<div class='row-header'>${stage.name}</div>`);
      day="",ul="";
      _.filter(data.events,(evt) => {
        return evt.location===stage.id && evt.type==="concert";
      }).map((evt) => {
        if(evt.date.slice(0,2)!==day){
          if(ul.length>0) result.push(ul+"</ul>");        
          ul="<ul class='list-group-program'>";
          day=evt.date.slice(0,2); 
        }
        artist=_.filter(this._artists,(item) => {
          return item.id===evt.performer
        })[0].name;
        ul=ul+`<li class='list-group-item-program'>${evt.date.slice(-5).replace(":","h")} : <a href=/artist/${evt.performer}/program>${artist}</a></li>`
      });
      if(ul.length>0) result.push(ul+"</ul>");  
    });
    this._innerHTML=result;// data formatted as html string for use in events summary (home page)
  }
  getArtistById(id:number):Artist{
    return _.filter(this._artists,(artist) => {
      return artist.id===id;
    })[0];
  }

  get innerHTML():string[]{
    return this._innerHTML
  }
  get pois():Poi[]{
    return this._pois;
  }
  get artists():Artist[]{
    return this._artists;
  }
}
export interface Poi {
  id:string,
  name:string,
  type:string
}
export interface Artist {
  id:number,
  name:string,
  description:string,
  composition:string,
  style:string
}
