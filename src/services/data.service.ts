import {Injectable, inject} from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import _ from "lodash";
import {Poi,Dates,Artist,Event, Infos, Transport, Faq, Message, Pass} from "./interfaces";
import { removeAccents} from './../app/utilities/functions/utlityFunctions';
import data from "./data.json";
import { getDateFromString } from '../app/utilities/functions/utlityFunctions';

@Injectable({
  providedIn: 'root' // single instance for the entire application
})
export class DataService {
  private _messages:Message[]=[];
  private _innerHTML:string[]=[];// data formatting as html string for use in events summary (home page)
  private _dates:Dates={} as Dates;
  private _pois:Poi[]=[];
  private _artists:Artist[]=[];
  private _events:Event[]=[];
  private _infos:Infos={} as Infos;
  private _faqs:Faq[]=[];
  private _partners:string[]=[];
  private _passes:Pass[]=[];

  constructor() {
    this.initData();
  }
  
  initData(){
    this._messages=_.filter(data.messages,(msg) => {
      return msg.active;
    });
    this._dates={start_date:new Date(data.dates[0].start_date),end_date:new Date(data.dates[0].end_date)};
    this._pois=data.pois;
    this._artists=data.artists;
    const obj:Transport={car:[],train:[],plane:[]} as Transport;
    data.transport.map((item) => {
      Object.keys(item).map((key) => {
        obj[key as keyof Transport].push(item[key as keyof object]);  
      })
    }),
    this._infos={
      opening:data.dates[0].opening,
      street:data.dates[0].street,
      city:data.dates[0].city,
      lat:data.dates[0].lat,
      lng:data.dates[0].lng,
      transport:obj,
    };
    this._faqs=data.faq;
    this._partners=[];
    data.partners.map((partner) => {
      this._partners.push(partner.file);
    });
    this._passes=data.ticketing;
    this.initInnerHTML();
    this.initEvents();
  }
  initInnerHTML(){    // data formatted as html string for use in events summary (home page)
    this._innerHTML=[""];
    _.range(this._dates.start_date.getDate(),this._dates.end_date.getDate()+1).map((day) => {
      this._innerHTML.push(`${new Date(this._dates.start_date.getMonth()+" " +day+","+this._dates.start_date.getFullYear()).toLocaleString("fr-FR",{day: 'numeric',month:"long"})}`);
    });
    this._innerHTML.map((item,idx) => {
      this._innerHTML[idx]=`<div class='column-header'>${item}</div>`
    });

    const stages=_.filter(this._pois,(poi) => {
      return poi.type==="stage";
    });   
    let day="", ul="",artist="";
    stages.map((stage) => {
      this._innerHTML.push(`<div class=row-header><a href=/map/${removeAccents(stage.name)}>${stage.name}</a></div>`);
      day="",ul="";
      _.filter(data.events,(evt) => {
        return evt.location===stage.id;
      }).map((evt) => {
        if(evt.date.slice(0,2)!==day){
          if(ul.length>0) this._innerHTML.push(ul+"</ul>");        
          ul="<ul class='list-group-program'>";
          day=evt.date.slice(0,2); 
        }
        artist=_.filter(this._artists,(item) => {
          return item.id===evt.performer
        })[0].name;
        ul=ul+`<li class='list-group-item-program'>${evt.date.slice(-5).replace(":","h")} : <a href=/artist/${evt.performer}>${artist}</a></li>`
      });
      if(ul.length>0) this._innerHTML.push(ul+"</ul>");  
    });
  }
  initEvents(){
    const evts:Event[]=[];
    data.events.map((evt) => {
      evts.push(
        {
          performer:_.filter(this._artists,(artist) => {
              return artist.id===evt.performer;
            })[0],
          type:evt.type,
          location:_.filter(this._pois,(poi) => {
              return poi.id===evt.location;
            })[0],
          date:evt.date,
        });
    });
    this._events=evts;
  }
  getArtistById(id:number):Artist{
    return _.filter(this._artists,(artist) => {
      return artist.id===id;
    })[0];
  }
  get messages (){
    return this._messages;
  }
  get innerHTML():string[]{
    return this._innerHTML
  }  
  get dates():Dates{
    return this._dates;
  }
  get pois():Poi[]{
    return this._pois;
  }
  get artists():Artist[]{
    return this._artists;
  }
  get events():Event[]{
    return this._events;
  }
  get infos():Infos {
    return this._infos;
  }
  get faqs() {
    return this._faqs;
  }
  get partners(){
    return this._partners;
  }
  get passes(){
    return this._passes;
  }
}

export const dataResolver: ResolveFn<void> =  //home page resolver
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject (DataService).initData();
};