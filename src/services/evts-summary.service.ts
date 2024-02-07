import { Injectable } from '@angular/core';
import _ from "lodash";
import data from "./data.json";

@Injectable({
  providedIn: 'root'
})
export class EvtsSummaryService {
  
  getFormattedData(){ // formats data for use in events summary (home page)
    const result:string[]=["","14 Juin","15 Juin","16 Juin"];
    result.map((item,idx) => {
      result[idx]=`<div class='column-header'>${item}</div>`
    });
    const stages=_.filter(data.pois,(poi) => {
      return poi.type==="stage";
    });    
    let day="", ul="";
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
        ul=ul+`<li class='list-group-item-program'>${evt.date.slice(-5).replace(":","h")} : ${evt.performer}</li>`
      });
      if(ul.length>0) result.push(ul+"</ul>");  
    });
    return result;
  }
}
