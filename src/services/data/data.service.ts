import {Injectable} from '@angular/core';
import _ from "lodash";
import { Poi, Dates, Artist, Event, Infos, Model, Transport } from '../interfaces';
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
    events:[]
  }

  constructor() {
    if(environment.apiMode==="local") this.loadLocalData();
  }
  
  loadLocalData(){   
    this._data=getLocalData();
    this.initInnerHTML();
  }
  formatApiData(col:string,data:any){
    switch(col){
      case "messages":
        this._data.messages=data.map((msg:any) => {
          return msg.acf;
        });
        break;
      case "dates":
        this._data.dates={start_date:new Date(data[0].acf.start_date),end_date:new Date(data[0].acf.end_date)};
        this._data.infos={
          opening:data[0].acf.opening_hours,street:data[0].acf.street,city:data[0].acf.city,
          lat:data[0].acf.lat,lng:data[0].acf.lng,transport:this._data.infos.transport
        }
        break;
      case "pois":
      case "artists":
      case "partners":
        this._data[col]=data.map((item:any) => {
          if(item.acf.image) item.acf.image=item.acf.image.url;
          return {id:item.id,...item.acf};
        });
        break;
      case "transports":
        this._data.infos.transport={car:[],train:[],plane:[]};
        _.sortBy(data,"title.rendered","asc").map((item:any) => {
          this._data.infos.transport[item.acf.transport_mean as keyof Transport].push(item.acf.description);
        });
        break;
      case "faqs":
        this._data[col]=data.map((item:any) => {
          return {...item.acf};
        })
        break;
      case "tickets":
        this._data.passes=data.map((item:any) => {
          return {
            category:item.acf.category,
            pass1:item.acf.price_1day,
            pass2:item.acf.price_2days,                
            pass3:item.acf.price_3days
          };
        });
        break; 
      case "events":       
        this._data[col]=data.map((item:any) => {
          if(item.acf.image) item.acf.image=item.acf.image.url;
          return {...item.acf,performer:item.acf.performer[0],location:item.acf.location[0]};
        });    
    }
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
}