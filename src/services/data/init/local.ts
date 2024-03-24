import _ from "lodash";
import data from './data.json';
import umap_data from '../../map/umap.json'
import {Transport, Model } from '../../interfaces';

export function getLocalData():Model{
  const messages={
    data:_.filter(data.messages,(msg) => {
      return msg.active;
    }),
    ready:true
  };
  const dates={
    data:{start_date:new Date(data.dates[0].start_date),end_date:new Date(data.dates[0].end_date)},    
    ready:true
  };
  const pois={
    data:data.pois,
    ready:true
  };
  const artists={
    data:data.artists,
    ready:true
  };
  const obj:Transport={car:[],train:[],plane:[]} as Transport;
  data.transport.map((item) => {
    Object.keys(item).map((key) => {
      obj[key as keyof Transport].push(item[key as keyof object]);  
    })
  });
  const infos={
    data:{
      opening:data.dates[0].opening,
      street:data.dates[0].street,
      city:data.dates[0].city,
      lat:data.dates[0].lat,
      lng:data.dates[0].lng,
      transport:obj
    },
    ready:true
  };
  const faqs={
    data:data.faq,
    ready:true
  };
  const partners:{data:any[],ready:boolean}={data:[],ready:false};
  data.partners.map((partner,idx) => {
    partners.data.push(partner.filename);
    if(idx===partners.data.length-1) partners.ready=true;
  });
  const passes={
    data:data.ticketing,
    ready:true
  };
  const events={
    data:data.events,  
    ready:true
  };
  const newsletters={
    data:data.newsletters,  
    ready:true
  };
  const umap_pois={
    url:"",
    data:umap_data,
    ready:true};
  
  return {messages,dates,pois,artists,infos,faqs,partners,passes,events,newsletters,umap_pois};
}