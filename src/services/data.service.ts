import {Injectable, inject} from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import _ from "lodash";
import {Poi,Dates,Artist,Style,Event, EventType, Infos, Transport, Faq, Message} from "./interfaces";
import { removeAccents} from './../app/utilities/functions/utlityFunctions';
import data from "./data.json";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _message:Message={} as Message;
  private _innerHTML:string[]=[];// data formatting as html string for use in events summary (home page)
  private _dates:Dates={} as Dates;
  private _event_types:EventType[]=[];
  private _pois:Poi[]=[];
  private _artists:Artist[]=[];
  private _styles:Style[]=[];
  private _events:Event[]=[];
  private _infos:Infos={} as Infos;
  private _faqs:Faq[]=[];
  private _partners:string[]=[];

  constructor() {
    this.initData();
  }
  
  initData(){
    this._message=_.filter(data.messages,(msg) => {
      return msg.active;
    })[0];
    this._dates=data.dates[0];
    this._event_types=data.event_types;
    this._pois=data.pois;
    this._artists=data.artists;
    this._styles=data.cat;
    const obj:Transport={car:[],train:[],plane:[]} as Transport;
    data.transport.map((item) => {
      Object.keys(item).map((key) => {
        obj[key as keyof Transport].push(item[key as keyof object]);  
      })
    }),
    this._infos={
      opening:data.dates[0].opening,
      address:data.dates[0].address,
      gps:data.dates[0].gps,
      transport:obj,
    };
    this._faqs=data.faq;
    this._partners=[];
    data.partners.map((partner) => {
      this._partners.push(partner.file);
    })
    this.initInnerHTML();
    this.initEvents();
  }
  initInnerHTML(){    // data formatted as html string for use in events summary (home page)
    this._innerHTML=[""];
    this._dates.days.split(",").map((day) => {
      this._innerHTML.push(`${new Date(this._dates.month+" " +day+","+this._dates.year).toLocaleString("fr-FR",{day: 'numeric',month:"long"})}`);
    });
    this._innerHTML.map((item,idx) => {
      this._innerHTML[idx]=`<div class='column-header'>${item}</div>`
    });

    const stages=_.filter(this._pois,(poi) => {
      return poi.type==="stage";
    });   
    let day="", ul="",artist="";
    stages.map((stage) => {
      this._innerHTML.push(`<div class=row-header><a href=/map/${removeAccents(stage.name)}/program>${stage.name}</a></div>`);
      day="",ul="";
      _.filter(data.events,(evt) => {
        return evt.location===stage.id && evt.type===1;
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
    const evts:Event[]=[];
    data.events.map((evt) => {
      evts.push(
        {
          performer:_.filter(this._artists,(artist) => {
              return artist.id===evt.performer;
            })[0],
          type:_.filter(data.event_types,(type) => {
            return type.id===evt.type;
          })[0],
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
  get message (){
    return this._message;
  }
  get innerHTML():string[]{
    return this._innerHTML
  }  
  get dates():Dates{
    return this._dates;
  }
  get event_types():EventType[]{
    return this._event_types;
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
  get infos():Infos {
    return this._infos;
  }
  get faqs() {
    return this._faqs;
  }
  get partners(){
    return this._partners;
  }
}

export const dataResolver: ResolveFn<void> =  //home page resolver
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject (DataService).initData();
};