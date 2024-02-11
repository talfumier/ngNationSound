import { Injectable } from '@angular/core';
import _ from "lodash";
import {Poi,Dates,Artist,Style,Event} from "./interfaces";
import data from "./data.json";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _innerHTML:string[]=[];// data formatting as html string for use in events summary (home page)
  private _dates:Dates[]=[];
  private _pois:Poi[]=[];
  private _artists:Artist[]=[];
  private _styles:Style[]=[];
  private _events:Event[]=[]

  constructor(){
    this.initData();
  }
  
  initData(){ 
    this._dates=data.dates;
    this._pois=data.pois;
    this._artists=data.artists;
    this._styles=data.cat;
    this.initInnerHTML();
    this.initEvents();
  }
  initInnerHTML(){    // data formatted as html string for use in events summary (home page)
    this._innerHTML=[""];
    this._dates[0].days.split(",").map((day) => {
      this._innerHTML.push(`${day} ${this._dates[0].month}`)
    });
    this._innerHTML.map((item,idx) => {
      this._innerHTML[idx]=`<div class='column-header'>${item}</div>`
    });

    const stages=_.filter(this._pois,(poi) => {
      return poi.type==="stage";
    });   
    let day="", ul="",artist="";
    stages.map((stage) => {
      this._innerHTML.push(`<div class='row-header'>${stage.name}</div>`);
      day="",ul="";
      _.filter(data.events,(evt) => {
        return evt.location===stage.id && evt.type==="concert";
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
          type:evt.type,
          location:_.filter(this._pois,(poi) => {
              return poi.id===evt.location;
            })[0],
          date:evt.date        
        });
    })
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
    return this._dates[0];
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
}
