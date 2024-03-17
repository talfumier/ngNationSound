import _ from "lodash";
import data from './data.json';
import umap_data from '../../map/umap.json'
import {Transport, Model } from '../../interfaces';

export function getLocalData():Model{
  const messages=_.filter(data.messages,(msg) => {
    return msg.active;
  });
  const dates={start_date:new Date(data.dates[0].start_date),end_date:new Date(data.dates[0].end_date)};
  const pois=data.pois;
  const artists=data.artists;
  const obj:Transport={car:[],train:[],plane:[]} as Transport;
  data.transport.map((item) => {
    Object.keys(item).map((key) => {
      obj[key as keyof Transport].push(item[key as keyof object]);  
    })
  });
  const infos={
    opening:data.dates[0].opening,
    street:data.dates[0].street,
    city:data.dates[0].city,
    lat:data.dates[0].lat,
    lng:data.dates[0].lng,
    transport:obj,
  };
  const faqs=data.faq;
  const partners:any=[];
  data.partners.map((partner) => {
    partners.push(partner.filename);
  });
  const passes=data.ticketing;
  const events=data.events;

  const umap_pois={url:"",data:umap_data,ready:true};
  
  return {messages,dates,pois,artists,infos,faqs,partners,passes,events,umap_pois};
}