export interface Message {
  text:string,criticality:string,active?:boolean
}
export interface Poi {
  id:string|number,
  name:string,
  type:string
}
export interface Dates{
  start_date:Date,
  end_date:Date,
}
export interface Artist {
  id:number,
  name:string,
  country:string,
  description:string,
  composition:string,
  style:string,
  filename?:string,
  image?:string
}
export interface Event {
  performer: number,
  type: string,
  location:string|number,
  date: string,
}
export interface ArtistEvents {
  performer:Artist,
  dates:EventDate[]
}
interface EventDate {
  date:string,
  location:Poi,
  type:string
}

export interface KeyLabel {
  key:string|number, label:string
}
export interface MinMax {
  min:string | number,max:string | number
}
export interface TimeOptions {
  "min":Option[],"max":Option[]
}
export interface Option {
  id:(string|number),name:string
}
export interface FormFilterElements {
  days:KeyLabel[],types:KeyLabel[],times:KeyLabel[],timeOptions:TimeOptions,artist:KeyLabel,artistOptions:Option[]
}
export interface Filter {
  days:object,
  time:object,
  types:object,
  artist:object
}
export interface OverlayLayer {
  name:string,
  features:L.GeoJSON
}
export interface Infos {
  opening:string,street:string,city:string,lat:string,lng:string,transport:Transport
}
export interface Transport {
  car:string[],train:string[],plane:string[]
}
export interface Faq {
  question:string,answer:string
}
export interface Pass {
  category:string,
  pass1:number,
  pass2:number,
  pass3:number,
}
export interface Model {
  messages:Message[],
  dates:Dates,
  pois:Poi[],
  artists:Artist[],
  infos:Infos,
  faqs:Faq[],
  partners:string[],
  passes:Pass[],
  events:Event[]
}
export interface FormattedPass {
  category:string,
  price:number
}